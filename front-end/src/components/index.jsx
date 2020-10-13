import React, { useState, useEffect } from 'react';
import MetadatasMap from "./MetadatasMap";

import { useHistory } from "react-router-dom";
import { metadataService } from '../_services/metamain_service';
import { includes } from 'lodash';


function LocationPage({ match }) {

  const { path } = match;
  const [metaDatas, setMetaDatas] = useState(null);
  const [isShows, setIsShows] = useState([]);
  const [isLoad, setIsLoad] = useState(false);
  const [checkValue, setCheckValue] = useState('');
  const [tempMetaDatas, setTempMetaDatas] = useState(metaDatas)
  const [latitude, setLatitude] = useState('55.583759');
  const [longitude, setLongitude] = useState('9.729960');



  const history = useHistory()


  useEffect(() => {
    metadataService.getAll()
      .then((x) => {
        setMetaDatas(x)
        setTempMetaDatas(x)
      })
  }, []);

  if (isLoad === false) {
    let tempArray = [];
    setIsShows([...tempArray]);
    setIsLoad(true)
  }

  function onToggleOpen(index) {
    let temps = [...isShows];
    temps[index] = !temps[index]
    setIsShows(temps)
  }


  function _handleInput(e) {
    if (e.target.value == '') {
      setMetaDatas(tempMetaDatas)
    }

    setCheckValue(e.target.value);
    setMetaDatas(tempMetaDatas)
    _handleRealtimeSearch(e.target.value);
  }

  function _handleKeydown(e) {
    if (e.key === 'Enter') {
      searchMetaData()
    }
    setMetaDatas(tempMetaDatas)
    // _handleRealtimeSearch(e.target.value);
  }

  function searchMetaData() {
    if (checkValue == '') {
      return
    }
    setMetaDatas(tempMetaDatas)
    setMetaDatas(metaDatas => metaDatas.filter(x => (x.technical_category) && (x.technical_category).toLowerCase() == checkValue.toLocaleLowerCase() || (x.equipment_name) && (x.equipment_name).toLowerCase() == checkValue.toLocaleLowerCase() || (x.service_interval) && (x.service_interval).toLowerCase() == checkValue.toLocaleLowerCase()
      || (x.legit) && (x.legit).toLowerCase() == checkValue.toLocaleLowerCase() || (x.latest_service) && (x.latest_service).toLowerCase() == checkValue.toLocaleLowerCase() || (x.expected_service) && (x.expected_service).toLowerCase() == checkValue.toLocaleLowerCase()
    ));
    setLatitude(metaDatas.latitude)
    setLongitude(metaDatas.longtitude)
  }

  function _handleRealtimeSearch(searchKey) {
    const filteredValue = metaDatas.filter(x => (x.technical_category) && ((x.technical_category).toLowerCase()).includes(searchKey.toLocaleLowerCase()) || (x.equipment_name) && ((x.equipment_name).toLowerCase()).includes(searchKey.toLocaleLowerCase()) || (x.service_interval) && ((x.service_interval).toLowerCase()).includes(searchKey.toLocaleLowerCase())
      || (x.legit) && ((x.legit).toLowerCase()).includes(searchKey.toLocaleLowerCase()) || (x.latest_service) && ((x.latest_service).toLowerCase()).includes(searchKey.toLocaleLowerCase()) || (x.expected_service) && ((x.expected_service).toLowerCase()).includes(searchKey.toLocaleLowerCase())
    )
    setMetaDatas(filteredValue)
  }

  function goMetaEdit(equipment_name) {
    history.push({
      pathname: `../metadata_main`,
      state: { equipment_name: equipment_name }
    });
  }

  if (metaDatas != null) {
    return (
      <div>
        <div className="flex-container">
          <img src="http://localhost:8080/src/assets/location.png" className="title-image" />
          <h3 className="title-text">Location View</h3>
        </div>
        <div className="flex-space-around-container">
          <div>
            <input type="text" placeholder="Search..." className="search-input" value={checkValue} onChange={(e) => _handleInput(e)} onKeyDown={(e) => _handleKeydown(e)} />
            <button className="search-button" onClick={(e) => searchMetaData()} ><i className="fa fa-search" style={{ fontSize: '20px' }}></i></button>
          </div>
        </div>
        <MetadatasMap
          isShows={isShows}
          onToggleOpen={onToggleOpen}
          goMetaEdit={goMetaEdit}
          metaDatas={metaDatas}
          googleMapURL={`https://maps.googleapis.com/maps/api/js?key=AIzaSyAyaRroGXXw-zWic_BrM7JPLzyTM2cc0V0&v=3.exp&libraries=geometry,drawing,places`}
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `650px` }} />}
          mapElement={<div style={{ height: `100%` }} />}
          lat={latitude}
          lng={longitude}
        />
      </div>
    );
  } else {
    return true
  }

}
export { LocationPage };