import React from 'react';
import createReactClass from 'create-react-class';
import {Timeline, TimelineEvent} from 'react-event-timeline'
import verified from '../assets/verified.png'
import dateUtil from "../helpers/DateUtil";

const History = createReactClass({
    render() {
        const {
            versions,
            matching,
            currentHash
        } = this.props;
        const numMatches = versions.filter((version) => version.hash === currentHash).length

        return (
            <div className="timeline-area">
                {matching && (
                    <div>Matched uploads: <b>{numMatches}</b></div>
                )}
                <Timeline>
                    {versions && versions
                    // .filter((version) => !this.props.filterMatches || this.props.currentHash === version.hash)
                    .map((version, i) => {
                        const timestampStr = dateUtil.formatEpochSeconds(version.timestamp)
                        const matchesHash = currentHash === version.hash
                        const versionNum = versions.length - i
                        return (
                            <TimelineEvent key={i}
                                           title={"Version " + versionNum}
                                           subtitle={"Size: " + (version.size / 1000) + "kb"}
                                           createdAt={timestampStr}
                                           icon={matchesHash &&
                                                <img alt="Verified match" src={verified} height={22} width={22} />}
                                           titleStyle={{ fontWeight: 'bold' }}
                            >
                                {matchesHash && <b>Verified match!</b>}
                            </TimelineEvent>
                        );
                    })
                    }
                </Timeline>
            </div>
        );
    }
});

export default History;

