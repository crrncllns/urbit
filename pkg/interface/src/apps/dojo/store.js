import Share from './components/lib/sole';
import api from './api';

export const buffer = new Share();

export class Store {
  constructor() {
    this.state = this.initialState();
    this.sync = this.sync.bind(this);
    this.print = this.print.bind(this);
  }

  initialState() {
    return {
      txt: [],
      prompt: '',
      cursor: 0,
      input: ''
    };
  }

  handleEvent(data) {
    // recursive handler
    if (data.data) {
      var dojoReply = data.data;
    } else {
      var dojoReply = data;
    }

    if (dojoReply.clear) {
      this.setState(this.initialState(), (() => {
        return;
      }));
    }

    // %mor sole-effects are nested, so throw back to handler
    if (dojoReply.map) {
      return dojoReply.map(reply => this.handleEvent(reply));
    }

    switch (Object.keys(dojoReply)[0]) {
      case 'txt':
        return this.print(dojoReply.txt);
      case 'tab':
        this.print(dojoReply.tab.match + ' ' + dojoReply.tab.info);
        return;
      case 'tan':
        return dojoReply.tan.split('\n').map(this.print);
      case 'pro':
        return this.setState({ prompt: dojoReply.pro.cad });
      case 'hop':
        return this.setState({ cursor: dojoReply.hop });
      case 'det':
        buffer.receive(dojoReply.det);
        return this.sync(dojoReply.det.ted);
      case 'act':
        switch (dojoReply.act) {
          case 'clr': return this.setState({ txt: [] });
          case 'nex': return this.setState({
            input: '',
            cursor: 0
          });
        }
        break;
      default: console.log(dojoReply);
    }
  }

  doEdit(ted) {
    const detSend = buffer.transmit(ted);
    this.sync(ted);
    return api.soto({ det: detSend });
  }

  print(txt) {
    const textLog = this.state.txt;
    textLog.push(txt);
    return this.setState({ txt: textLog });
  }

  sync(ted) {
    return this.setState({
      input: buffer.buf,
      cursor: buffer.transpose(ted, this.state.cursor)
    });
  }

  setStateHandler(setState) {
    this.setState = setState;
  }
}

const store = new Store();
export default store;
