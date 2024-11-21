import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import 'leaflet/dist/leaflet.css';

const LocationMap = ({ district, city, province }) => {
    const [position, setPosition] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCoordinates = async () => {
            try {
                // Tạo địa chỉ đầy đủ
                const addressQuery = `${district}, ${city}, ${province}, Vietnam`;

                // Sử dụng Nominatim - dịch vụ Geocoding miễn phí của OpenStreetMap
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressQuery)}`
                );

                const data = await response.json();

                if (data && data.length > 0) {
                    // Lấy tọa độ của kết quả đầu tiên
                    const { lat, lon } = data[0];
                    setPosition([parseFloat(lat), parseFloat(lon)]);
                } else {
                    setError('Không tìm thấy địa điểm');
                }
            } catch (err) {
                setError('Lỗi khi tìm kiếm địa điểm');
            } finally {
                setIsLoading(false);
            }
        };

        if (district || city || province) {
            fetchCoordinates();
        }
    }, [district, city, province]);

    // Component loading
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[300px]">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
            </div>
        );
    }

    // Xử lý lỗi
    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {error}
            </div>
        );
    }

    // Nếu không có tọa độ
    if (!position) {
        return (
            <div className="text-center text-gray-500">
                Không thể xác định vị trí
            </div>
        );
    }

    return (
        <MapContainer
            center={position}
            zoom={13}
            scrollWheelZoom={false}
            style={{height: "300px", width: "100%"}}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
                <Popup>
                    {district}, {city}, {province}
                </Popup>
            </Marker>
        </MapContainer>
    );
};

export default LocationMap;