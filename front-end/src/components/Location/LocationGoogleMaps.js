// LocationGooglMaps.js
import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import AutoComplete from './Autocomplete';
import Marker from './Marker';
import settings from '../../settings';

class LocationGooglMap extends Component {
    state = {
        mapApiLoaded: false,
        mapInstance: null,
        mapApi: null,
        geoCoder: null,
        places: [this.props.location.lat, this.props.location.lng],
        center: [this.props.location.lat, this.props.location.lng],
        zoom: this.props.zoom,
        address: '',
        draggable: true,
        lat: this.props.location.lat,
        lng: this.props.location.lng
    };

    componentDidMount() {
        this.setCurrentLocation();
    }

    onMarkerInteraction = (childKey, childProps, mouse) => {
        this.setState({
            draggable: false,
            lat: mouse.lat,
            lng: mouse.lng
        });
    }

    onMarkerInteractionMouseUp = (childKey, childProps, mouse) => {
        this.setState({ draggable: true });
        this._generateAddress();
    }

    _onChange = ({ center, zoom }) => {
        this.setState({
            center: center,
            zoom: zoom,
        });
    }

    _onClick = (value) => {
        this.setState({
            lat: value.lat,
            lng: value.lng
        });

        if (this.props.handleChange) {
            this.props.handleChange({
                lat: value.lat,
                lng: value.lng
            })
        }
    }

    apiHasLoaded = (map, maps) => {
        this.setState({
            mapApiLoaded: true,
            mapInstance: map,
            mapApi: maps,
        });

        this._generateAddress();
    };

    addPlace = (place) => {
        this.setState({
            places: [place],
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
        });
        this._generateAddress()
    };

    _generateAddress() {
        const {
            mapApi
        } = this.state;
        const geocoder = new mapApi.Geocoder();
        geocoder.geocode({ 'location': { lat: this.state.lat, lng: this.state.lng } }, (results, status) => {
            if (status === 'OK') {
                if (results[0]) {
                    this.zoom = 12;
                    this.setState({ address: results[0].formatted_address });
                } else {
                    console.log('No results found');
                }
            } else {
                console.log('Geocoder failed due to: ' + status);
            }
        });
    }

    // Get Current Location Coordinates
    setCurrentLocation() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.setState({
                    center: [position.coords.latitude, position.coords.longitude],
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            });
        }
    }

    render() {
        const {
            mapApiLoaded, mapInstance, mapApi,
        } = this.state;

        return (
            <>
                {mapApiLoaded && this.props.editable && (
                    <div>
                        <AutoComplete map={mapInstance} mapApi={mapApi} addplace={this.addPlace} />
                    </div>
                )}
                <GoogleMapReact
                    defaultCenter={this.state.center}
                    defaultZoom={this.state.zoom}
                    draggable={this.state.draggable}
                    onChange={this._onChange}
                    onChildMouseDown={this.onMarkerInteraction}
                    onChildMouseUp={this.onMarkerInteractionMouseUp}
                    onChildMouseMove={this.onMarkerInteraction}
                    onClick={this._onClick}
                    bootstrapURLKeys={{
                        key: settings.google.apiKey,
                        libraries: ['places', 'geometry'],
                    }}
                    yesIWantToUseGoogleMapApiInternals
                    onGoogleApiLoaded={({ map, maps }) => this.apiHasLoaded(map, maps)}
                >
                    <Marker
                        text={this.state.address}
                        lat={this.state.lat}
                        lng={this.state.lng}
                    />
                </GoogleMapReact>
            </ >
        );
    }
}

export default LocationGooglMap;