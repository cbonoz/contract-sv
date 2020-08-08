import React from "react";
import createReactClass from "create-react-class";
import { Timeline, TimelineEvent } from "react-event-timeline";
import verified from "../assets/verified.png";
import dateUtil from "../helpers/DateUtil";
import api from "../helpers/api";
import { Button, Toast } from "react-bootstrap";

const History = createReactClass({
  componentWillMount() {
    this.setState({
      filterMatches: false,
      copyResult: null,
      link: "",
    });
  },

  async copyLink(txHash) {
    const linkText = `${window.location.origin}/validate/${txHash}`;
    try {
      await navigator.clipboard.writeText(linkText);
      this.setState({
        copyResult: "Copied!",
        link: linkText,
      });
    } catch (err) {
      this.setState({
        copyResult: "Error copying link. Please try again.",
        link: "",
      });
    }
  },

  render() {
    const { versions, matching, currentHash } = this.props;
    const { link } = this.state;

    const numMatches = versions.filter(
      (version) => version.hash === currentHash
    ).length;

    return (
      <div className="timeline-area">
        <Toast
          onClose={() => this.setState({ copyResult: null })}
          show={this.state.copyResult}
          delay={500}
          autohide
        >
          <Toast.Body>{this.state.copyResult}</Toast.Body>
        </Toast>
        {matching && (
          <div>
            Matched versions: <b>{numMatches}</b>
            <br />
            <input
              type="checkbox"
              checked={this.state.filterMatches}
              onChange={() =>
                this.setState({ filterMatches: !this.state.filterMatches })
              }
            />{" "}
            Hide documents that don't match
          </div>
        )}
        <Timeline>
          {versions &&
            versions
              .filter(
                (version) =>
                  !this.state.filterMatches || currentHash === version.hash
              )
              .map((version, i) => {
                const timestampStr = dateUtil.formatEpochSeconds(
                  version.timestamp
                );
                const matchesHash = currentHash === version.hash;
                const versionNum = versions.length - i;
                return (
                  <TimelineEvent
                    key={i}
                    title={"Version " + versionNum}
                    subtitle={"Size: " + version.size / 1000 + "kb"}
                    createdAt={timestampStr}
                    icon={
                      matchesHash && (
                        <img
                          alt="Verified match"
                          src={verified}
                          height={22}
                          width={22}
                        />
                      )
                    }
                    titleStyle={{ fontWeight: "bold" }}
                  >
                    {matchesHash && (
                      <div>
                        <b>Verified match!</b>
                        <br />
                        <br />
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => this.copyLink(version.tx_hash)}
                        >
                          Copy verification link
                        </Button>
                        {link && (
                          <p>
                            <a href={link} target="_blank">
                              {link}
                            </a>
                          </p>
                        )}
                      </div>
                    )}
                  </TimelineEvent>
                );
              })}
        </Timeline>
      </div>
    );
  },
});

export default History;
