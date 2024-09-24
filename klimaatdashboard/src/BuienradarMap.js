import React from "react";

const BuienradarMap = ({ lat, lng, zoom, name, width, height }) => {
  const src = `https://gadgets.buienradar.nl/gadget/zoommap/?lat=${lat}&lng=${lng}&overname=2&zoom=${zoom}&naam=${name}&size=2b&voor=1`;

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <iframe
        title={`Buienradar in ${name}`}
        src={src}
        scrolling="no"
        width={width}
        height={height}
        frameBorder="no"
        style={{ border: 0 }}
      ></iframe>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: `${width}px`,
          height: `${height}px`,
          zIndex: 1,
          backgroundColor: "transparent",
        }}
      ></div>
    </div>
  );
};

export default BuienradarMap;
