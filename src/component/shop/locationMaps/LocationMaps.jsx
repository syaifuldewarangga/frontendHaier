import React, { Component, useEffect } from "react";
import './LocationMaps.css';

const LocationMaps = (props) =>
{
    const changeMaps = () => {
        window.addEventListener("load", function() {
            var maspID = document.createElement('iframe')
            maspID.id = 'mapsData';
            maspID.src = 'https://maps.google.com/maps?q='+props.latitude+', '+props.longitude+'&hl=fa;z=14&ie=UTF8&output=embed&hl=en';
            maspID.width = "100%"
            maspID.height = "650"
            maspID.loading = "lazy"
            document.getElementById("mapAnchor").appendChild(maspID);
        })
    }

    useEffect(() => {
        changeMaps()
    }, [])
    
    return (    
        <div>
            <div className="shop-location">
                <div className="container-fluid">
                    <div className="px-5">
                        <div className="location-header">
                            <span>{props.title}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div id="mapAnchor"> </div>
        </div>
    );
}

export default LocationMaps;