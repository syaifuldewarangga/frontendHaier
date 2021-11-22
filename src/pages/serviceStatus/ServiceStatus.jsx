import React, { Component } from "react";
import ServiceRecord from "../../component/serviceStatus/ServiceRecord/ServiceRecord";
import ServiceStatusMenu from "../../component/serviceStatus/serviceStatusMenu/ServiceStatusMenu";

class ServiceStatus extends Component 
{
    render () {
        return (
            <div>
                <div className="container-fluid">
                    <div className="px-lg-5">
                        <div className="px-lg-3">
                            <ServiceStatusMenu />
                        </div>
                        <div className="px-lg-1">
                            <ServiceRecord />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ServiceStatus;