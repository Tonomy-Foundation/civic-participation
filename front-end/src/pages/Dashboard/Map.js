import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import settings from '../../settings';

const MapContainer = (props) => {
    const { selected } = props;
    const mapStyles = {
        height: "86vh",
        width: "100%"
    };
    const defaultCenter = {
        lat: 52.1135031, lng: 4.2829047
    }
    const [currentPosition, setCurrentPosition] = useState(defaultCenter);

    useEffect(() => {
        if (selected && selected.proposalId) {
            setCurrentPosition(selected.position);
        }
    }, [selected])

    return (
        <LoadScript
            googleMapsApiKey={settings.google.apiKey}>
            <GoogleMap
                mapContainerStyle={mapStyles}
                zoom={props.zoom}
                center={currentPosition}>
                {
                    props.selectedProposals.map(item => {
                        return (
                            <Marker
                                key={item.proposalId}
                                position={item.position}
                                onClick={() => props.onSelect(item)}
                            >
                                {
                                    (selected && selected.proposalId === item.proposalId) &&
                                    (
                                        <InfoWindow
                                            position={item.position}
                                            onCloseClick={() => props.onSelect({})}
                                        >
                                            <p>{item.title}</p>
                                        </InfoWindow>
                                    )
                                }
                            </Marker>
                        )
                    })
                }

            </GoogleMap>
        </LoadScript>
    )
}

export default MapContainer;