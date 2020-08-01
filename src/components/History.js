import React from 'react';
import createReactClass from 'create-react-class';
import {Timeline, TimelineEvent} from 'react-event-timeline'

const History = createReactClass({
    render() {
        const versions = this.props.versions;
        return (
            <Timeline>
            {versions && versions.map((version, i) => {
                let timestamp = new Date(version["timestamp"] * 1000) // timestamp is in epoch seconds
                let timestampStr = timestamp.toLocaleDateString() + " " + timestamp.toLocaleTimeString()
                return (
                    <TimelineEvent key={i} title={version["hash"]}
                                   createdAt={timestampStr}
                                   titleStyle={{ fontWeight: 'bold' }}
                    >
                        Some extra text
                    </TimelineEvent>
                );
            })}
            </Timeline>
        );
    }
});

export default History;

