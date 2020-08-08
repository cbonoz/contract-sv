import React from 'react';
import createReactClass from 'create-react-class';
import {Timeline, TimelineEvent} from 'react-event-timeline'
import verified from '../assets/verified.png'
import dateUtil from "../helpers/DateUtil";

const History = createReactClass({
    componentWillMount() {
        this.setState({
            filterMatches: false
        })
    },

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
                    <div>
                        Matched versions: <b>{numMatches}</b>
                        <br/>
                        <input type="checkbox"
                               checked={this.state.filterMatches}
                               onChange={() => this.setState({filterMatches: !this.state.filterMatches})}
                        /> Hide documents that don't match
                    </div>
                )}
                <Timeline>
                    {versions && versions
                    .filter((version) => !this.state.filterMatches || currentHash === version.hash)
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

