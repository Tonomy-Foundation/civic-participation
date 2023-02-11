import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";

import { toLabel as categoryToLabel } from "../../types/proposals/categories";

import settings from "../../settings";
import styled from "styled-components";
import GoogleMapReact from "google-map-react";
import Card from "./Card";

const InfoWindow = (props) => {
  const history = useHistory();
  const { place } = props;
  const infoWindowStyle = {
    position: "relative",
    left: "20px",
    width: 300,
    backgroundColor: "white",
    boxShadow: "0 2px 7px 1px rgba(0, 0, 0, 0.3)",
    padding: 12,
    fontSize: 14,
    zIndex: 100,
    display: "flex",
    flexDirection: "row",
  };

  return (
    <div
      style={infoWindowStyle}
      onClick={() => {
        history.push(`/proposal/${place.proposalId}`);
      }}
    >
      <img
        alt={place.title}
        src={place.photo}
        style={{
          width: "100px",
          height: "100px",
          marginRight: "12px",
          cursor: "pointer",
        }}
      />

      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          cursor: "pointer",
        }}
      >
        <div style={{ fontSize: 17, fontWeight: 500 }}>{place.title}</div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontSize: 14, marginTop: "4px" }}>
            {categoryToLabel(place.category)}
          </div>
          <div style={{ fontSize: 14, marginTop: "4px", color: "#ce2226" }}>
            {place.status === 2 && "Open to votes"}
          </div>
        </div>
        <div
          style={{ fontSize: 14, marginTop: "8px", display: "flex", flex: "1" }}
        >
          {place.description.length > 70
            ? `${place.description.substring(0, 70)}...`
            : place.description}
        </div>
      </div>
    </div>
  );
};

// Marker component
const Marker = ({ place, selected }) => {
  const markerStyle = {
    width: 38,
    height: 37,
    backgroundImage:
      "url(https://icon-library.com/images/pin-icon-png/pin-icon-png-9.jpg)",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    cursor: "pointer",
    zIndex: 10,
  };

  return (
    <>
      <div style={markerStyle} />
      {selected && <InfoWindow place={place} />}
    </>
  );
};

const Wrapper = styled.section`
  width: 100vw;
  height: 90vh;
`;

function DashboardMap(props) {
  const { selected } = props;

  const defaultCenter = {
    lat: 52.11935031,
    lng: 4.2829047,
  };

  const [currentPosition, setCurrentPosition] = useState(defaultCenter);

  useEffect(() => {
    if (selected && selected.proposalId) {
      setCurrentPosition(selected.position);
    }
  }, [selected]);

  const onChildClickCallback = (key) => {
    const proposal = props.selectedProposals.find(x => x.proposalId == key)
    props.onSelect(proposal);
  };

  return (
    <Wrapper>
      {true && (
        <GoogleMapReact
          defaultZoom={props.zoom}
          yesIWantToUseGoogleMapApiInternals={true}
          defaultCenter={defaultCenter}
          bootstrapURLKeys={{
            key: settings.google.apiKey,
            libraries: ["places", "geometry"],
          }}
          onChildClick={onChildClickCallback}
          center={currentPosition}
        >
          {props.selectedProposals.map((place) => {
            return (
              <Marker
                key={place.proposalId}
                lat={place.position.lat}
                lng={place.position.lng}
                show={true}
                place={place}
                selected={
                  selected.proposalId == place.proposalId ? true : false
                }
              />
            );
          })}
        </GoogleMapReact>
      )}
    </Wrapper>
  );
}

InfoWindow.propTypes = {
  place: PropTypes.shape({
    name: PropTypes.string,
    formatted_address: PropTypes.string,
    rating: PropTypes.number,
    types: PropTypes.arrayOf(PropTypes.string),
    price_level: PropTypes.number,
    opening_hours: PropTypes.shape({
      open_now: PropTypes.bool,
    }),
  }).isRequired,
};

Marker.propTypes = {
  show: PropTypes.bool.isRequired,
  place: PropTypes.shape({
    name: PropTypes.string,
    formatted_address: PropTypes.string,
    rating: PropTypes.number,
    types: PropTypes.arrayOf(PropTypes.string),
    price_level: PropTypes.number,
    opening_hours: PropTypes.shape({
      open_now: PropTypes.bool,
    }),
  }).isRequired,
};

export default DashboardMap;
