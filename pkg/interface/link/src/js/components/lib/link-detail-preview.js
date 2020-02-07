import React, { Component } from 'react';
import { Route, Link } from "react-router-dom";
import { base64urlEncode } from "../../lib/util";
import moment from "moment";

export class LinkPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeSinceLinkPost: this.getTimeSinceLinkPost(this.props.data)
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      if (this.state.timeSinceLinkPost === "") {
        this.setState({
          timeSinceLinkPost: this.getTimeSinceLinkPost(this.props.data)
        });
      }
    }
  }

  componentDidMount() {
    this.updateTimeSinceNewestMessageInterval = setInterval(() => {
      this.setState({
        timeSinceLinkPost: this.getTimeSinceLinkPost(this.props.data)
      });
    }, 60000);
  }

  componentWillUnmount() {
    if (this.updateTimeSinceNewestMessageInterval) {
      clearInterval(this.updateTimeSinceNewestMessageInterval);
      this.updateTimeSinceNewestMessageInterval = null;
    }
  }

  getTimeSinceLinkPost(data) {
    return !!data.time
      ? moment.unix(data.time / 1000).from(moment.utc())
      : "";
  }

  render() {
    const { props } = this;

    let URLparser = new RegExp(
      /((?:([\w\d\.-]+)\:\/\/?){1}(?:(www)\.?){0,1}(((?:[\w\d-]+\.)*)([\w\d-]+\.[\w\d]+))){1}(?:\:(\d+)){0,1}((\/(?:(?:[^\/\s\?]+\/)*))(?:([^\?\/\s#]+?(?:.[^\?\s]+){0,1}){0,1}(?:\?([^\s#]+)){0,1})){0,1}(?:#([^#\s]+)){0,1}/
    );

    let hostname = URLparser.exec(props.url);

    if (hostname) {
      hostname = hostname[4];
    }

    let imgMatch = /(jpg|img|png|gif|tiff|jpeg|JPG|IMG|PNG|TIFF|GIF|webp|WEBP|webm|WEBM)$/.exec(
      props.url
    );

    let youTubeRegex = new RegExp(
      "" +
      /(?:https?:\/\/(?:[a-z]+.)?)/.source + // protocol
      /(?:youtu\.?be(?:\.com)?\/)(?:embed\/)?/.source + // short and long-links
        /(?:(?:(?:(?:watch\?)?(?:time_continue=(?:[0-9]+))?.+v=)?([a-zA-Z0-9_-]+))(?:\?t\=(?:[0-9a-zA-Z]+))?)/.source // id
    );

    let ytMatch = youTubeRegex.exec(props.url);

    let embed = "";

    if (imgMatch) {
      embed = <img className="db w-50"
                   src={props.url}
                   style={{maxHeight: "100%", maxWidth: "500px", margin: "0 auto"}}/>
    }

    if (ytMatch) {
      embed = (
        <iframe
          ref="iframe"
          width="560"
          height="315"
          src={`https://www.youtube.com/embed/${ytMatch[1]}`}
          frameBorder="0"
          allow="picture-in-picture, fullscreen"></iframe>
      );
    }

    let nameClass = props.nickname ? "inter" : "mono";

    return (
      <div className="pb6 w-100">
        <div
          className={"w-100 " + (ytMatch ? "embed-container" : "")}
          style={{ maxHeight: "500px" }}>
          {embed}
        </div>
        <div className="flex flex-column ml2 pt6">
          <a href={props.url} className="w-100 flex" target="_blank">
            <p className="f8 truncate">
              {props.title}
              <span className="gray2 ml2 flex-shrink-0">{hostname} ↗</span>
            </p>
          </a>
          <div className="w-100 pt1">
            <span className={"f9 pr2 white-d v-mid " + nameClass}>
              {props.nickname ? props.nickname : "~" + props.ship}
            </span>
            <span className="f9 inter gray2 pr3 v-mid">
              {this.state.timeSinceLinkPost}
            </span>
            <Link
              to={
                "/~link" +
                props.groupPath +
                "/" +
                props.page +
                "/" +
                props.linkIndex +
                "/" +
                base64urlEncode(props.url)
              }
              className="v-top">
              <span className="f9 inter gray2">{props.comments}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default LinkPreview;