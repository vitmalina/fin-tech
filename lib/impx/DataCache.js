
export class DataCache extends EventTarget {
  constructor() {
    super ();
    this.schema = {};
    this.data = {};
  }

  onSchema (message) {
    const Name = message.Name;

    if (!(Name in this.schema)) {
      this.schema[Name] = message;
      this.data[Name] = new Map();
    
      console.log ("schema: ", message);
      this.dispatchEvent (new CustomEvent("schema", { detail: { Name, message }}));
    }
  }

  onDataEvent (message) {
    const Name = message.Name;

    if (!(Name in this.schema)) { // this should not happen can happen for some apps that we get update before snapshot, so ignore them
      console.warn ("received update before schema");
      return;
    }

    message.Data.forEach((dataItem) => {
      switch (dataItem.RowData.UpdateOp) {
        case "U":
          this.data[Name].set (dataItem.RowId, dataItem.RowData);
          break
        case "N":
          this.data[Name].set (dataItem.RowId, dataItem.RowData);
          break
        case "D":
          this.data[Name].delete (dataItem.RowId);
          break
        default:
          console.log ("update op is invalid: ", dataItem.RowData.UpdateOp);
          break
      }
      this.dispatchEvent (new CustomEvent ("data", { detail: { Name, data: dataItem }}));
      //console.log("data event", dataItem);
    });
  }

  getData(name, id) {
    if (!(name in this.data)) {
      console.warn(`Data does not have : ${name}`);
      return null
    }
    if (!this.data[name].has(id)) {
      console.warn(`Data not found for name: ${name}, id: ${id}`);
      return null
    }
    return this.data[name].get(id);

  }

    subscribe (name, callback) {
        if (name === "schema") {
            for (const item in this.schema) {
                callback (new CustomEvent ("schema", { detail: { Name: item, message: this.schema[item] }}));
            }

        this.addEventListener ("schema", callback);
        }
        else if (name === "data") {
            const items = Object.keys(this.data);

            if (items.length > 0) {
                for (const item of items) {
                    if (this.data[item].size > 0) {
                        let detailsArray = [];
          
                        for (const [key, value] of this.data[item]) {
                            const detail = { Name: item, data: { RowData: value, RowId: key }};
                            detailsArray.push(detail);
                        }

                    callback (new CustomEvent ("data", { detail: {Name: item, dataArray: detailsArray}}));
                    }
                }

            this.addEventListener ("data", callback);
            }
        }
    }
}

