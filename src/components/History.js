import React from 'react';
import createReactClass from 'create-react-class';
import {Timeline, TimelineEvent} from 'react-event-timeline'
import verified from '../assets/verified.png'
import dateUtil from "../helpers/DateUtil";

const History = createReactClass({
    render() {
        const versions = this.props.versions;
        return (
            <Timeline>
            {versions && versions
                            .filter((version) => !this.props.filterMatches || this.props.currentHash === version.hash)
                            .map((version, i) => {
                    const timestampStr = dateUtil.formatEpochSeconds(version.timestamp)
                    const matchesHash = this.props.currentHash === version.hash
                    return (
                        <TimelineEvent key={i} title={version.hash}
                                       createdAt={timestampStr}
                                       icon={matchesHash && <img alt="Verified match" src={verified} height={22} width={22} />}
                                       titleStyle={{ fontWeight: 'bold' }}
                        >
                            {matchesHash && <b>Verified match!</b>}
                        </TimelineEvent>
                    );
                })
            }
            </Timeline>
        );
    }
});

export default History;

