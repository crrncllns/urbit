import _ from 'lodash';

export default class MetadataReducer {
  reduce(json, state) {
    let data = _.get(json, 'metadata-update', false);
    if (data) {
      this.log(data, state);
      this.associations(data, state);
      this.add(data, state);
      this.update(data, state);
      this.remove(data, state);
    }
  }

  log(json, state) {
    console.log(json);
  }

  associations(json, state) {
    let data = _.get(json, 'associations', false);
    if (data) {
      let metadata = {};
      Object.keys(data).forEach((key) => {
        let val = data[key];
        let groupPath = val['group-path'];
        if (!(groupPath in metadata)) {
          metadata[groupPath] = {};
        }
        metadata[groupPath][key] = val;
      });
      state.associations = metadata;
    }
  }

  add(json, state) {
    let data = _.get(json, 'add', false);
    if (data) {
      let metadata = state.associations;
      if (!(data['group-path'] in metadata)) {
        metadata[data['group-path']] = {};
      }
      metadata[data['group-path']]
        [`${data["group-path"]}/${data["app-name"]}${data["app-path"]}`] = data;

      state.associations = metadata;
    }
  }

  update(json, state) {
    let data = _.get(json, 'update-metadata', false);
    if (data) {
      let metadata = state.associations;
      if (!(data["group-path"] in metadata)) {
        metadata[data["group-path"]] = {};
      }
      metadata[data["group-path"]][
        `${data["group-path"]}/${data["app-name"]}${data["app-path"]}`
      ] = data;

      state.associations = metadata;
    }
  }

  remove(json, state) {
    let data = _.get(json, 'remove', false);
    if (data) {
      let metadata = state.associations;
      if (data['group-path'] in metadata) {
        let path =
        `${data['group-path']}/${data['app-name']}${data['app-path']}`
        delete metadata[data["group-path"]][path];
        state.associations = metadata;
      }
    }
  }
}
