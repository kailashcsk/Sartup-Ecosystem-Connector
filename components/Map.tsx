"use client";

// START: Preserve spaces to avoid auto-sorting
import "leaflet/dist/leaflet.css";

import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";

import "leaflet-defaulticon-compatibility";
// END: Preserve spaces to avoid auto-sorting
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import Link from 'next/link';
import { ArrowLeft, CalendarIcon, ClockIcon, ExternalLinkIcon, InfoIcon, PinIcon, ThumbsUpIcon } from "lucide-react";
import L from "leaflet";
import { Badge } from "./ui/badge";

const fills = {
    "Tech Fairs": "#eab308",
    "Investor Summits": "#dc2626",
    "Networking Mixers and Meetups": "#4f46e5"
}

export default function Map({ recommendations }) {
    return (
        <div style={{ position: 'relative' }}>
            <MapContainer
                preferCanvas={true}
                center={[41.836380, -87.616190]}
                zoom={14}
                scrollWheelZoom={true}
                style={{ height: "100vh", width: "100vw" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[41.836380, -87.616190]}
                    icon={
                        // @ts-ignore
                        new L.divIcon({
                            className: 'custom-icon',
                            html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#65a30d" width="40px" height="40px">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>`,
                            iconSize: [100, 100],
                            iconAnchor: [12, 24],
                            popupAnchor: [0, -24]
                        })
                    }
                >
                    <Popup>
                        Your Location
                    </Popup>
                </Marker>
                {
                    Object.keys(recommendations).map((key) => {
                        return recommendations[key].map((recom, index) => {
                            return (
                                <Marker key={index} position={[recom.coordinates[0], recom.coordinates[1]]}
                                    icon={
                                        // @ts-ignore
                                        new L.divIcon({
                                            className: 'custom-icon',
                                            html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${fills[key]}" width="40px" height="40px">
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                    </svg>`,
                                            iconSize: [100, 100],
                                            iconAnchor: [12, 24],
                                            popupAnchor: [8, -24]
                                        })
                                    }
                                >
                                    <Popup>
                                        <div className="flex items-center justify-start mb-2">
                                            <h3 className="text-xl font-semibold">{recom.name}</h3>
                                        </div>

                                        <div className="flex items-center gap-3 h-12">
                                            <PinIcon className="w-6 h-6 text-gray-500" />
                                            <p className="text-gray-600">{recom.location}</p>
                                        </div>


                                        <div className="flex items-center justify-between w-full h-10">
                                            <div className="flex items-center space-between gap-2">
                                                <CalendarIcon className="w-5 h-5 text-gray-500" />
                                                <p className="text-gray-600">{recom.date}</p>
                                            </div>
                                            <div className="flex items-center space-between gap-2">
                                                <ClockIcon className="w-5 h-5 text-gray-500" />
                                                <p className="text-gray-600">{recom.startTime}</p>
                                            </div>
                                        </div>

                                        <p className="text-gray-700 mb-1">{recom.description}</p>

                                        <div className="flex items-center bg-gray-200 border border-gray-300 rounded-md p-3">
                                            <p className="text-sm text-gray-800">
                                                {recom.recommendation}</p>
                                        </div>

                                        <a
                                            href={recom.eventLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-center w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            <ExternalLinkIcon className="w-4 h-4 mr-2" />
                                            View Event
                                        </a>

                                    </Popup>
                                </Marker>
                            );
                        });
                    })
                }
            </MapContainer>
            <Link href="/" style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                padding: '8px',
                backgroundColor: 'white',
                color: 'black',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                zIndex: 9999,
                borderRadius: '100px',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                fontWeight: 'bold'
            }}>
                <ArrowLeft style={{ marginRight: '0px' }} />
            </Link>
            <div
                style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '10px',
                    padding: '8px',
                    backgroundColor: 'white',
                    color: 'black',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'start',
                    flexDirection: 'column',
                    gap: 8,
                    zIndex: 9999,
                    borderRadius: '10px',
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                    fontWeight: 'semibold',
                    fontSize: '14px'
                }}
            >
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'

                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#65a30d" width="24px" height="24px">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                    <div>Your Location</div>
                </div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'

                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#eab308" width="24px" height="24px">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                    <div>Tech Fairs</div>
                </div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'

                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#dc2626" width="24px" height="24px">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                    <div>Investor Summits</div>
                </div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'

                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#4f46e5" width="24px" height="24px">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                    <div>Networking Mixers and Meetups</div>
                </div>
            </div>
        </div>
    );
}