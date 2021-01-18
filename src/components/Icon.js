import React from "react";
import PropTypes from "prop-types";

const Download = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
    <path d="M0 0h24v24H0z" fill="none" />
  </svg>
);

const Music = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z" />
  </svg>
);

const Play = ({ className }) => (
  <svg
    className={className}
    height="24"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
  </svg>
);

const Pause = ({ className }) => (
  <svg
    className={className}
    height="24"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M9 16h2V8H9v8zm3-14C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-4h2V8h-2v8z" />
  </svg>
);

const Replay = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
  </svg>
);

const Spin = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 42 42"
  >
    <path d="M21 37c-4.3 0-8.3-1.7-11.3-4.7S5 25.3 5 21c0-3 .8-6 2.5-8.5C9 10 11.2 8 13.8 6.7l1.3 2.7c-2.1 1.1-3.9 2.7-5.2 4.7-1.3 2.1-2 4.5-2 6.9 0 7.2 5.8 13 13 13s13-5.8 13-13c0-2.5-.7-4.9-2-6.9s-3.1-3.6-5.2-4.7L28 6.7c2.8 1.3 5 3.3 6.5 5.8C36.2 15 37 18 37 21c0 4.3-1.7 8.3-4.7 11.3S25.3 37 21 37z" />
  </svg>
);

const ChangeSpeed = ({className}) => (
  <svg  className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path fill="#fff" d="M12 14l9-5-9-5-9 5 9 5z" />
    <path fill="#fff" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
  </svg>
);

const Icon = props => {
  let El = Download;
  switch (props.name) {
    case "music":
      El = Music;
      break;
    case "play":
      El = Play;
      break;
    case "pause":
      El = Pause;
      break;
    case "replay":
      El = Replay;
      break;
    case "spin":
      El = Spin;
      break;
    case "changespeed":
      El = ChangeSpeed;
      break;
    default:
      El = Download;
      break;
  }
  return (
    <El
      className={`rvt-icon rat-icon-${props.name} ${props.className}`.trim()}
    />
  );
};

Icon.propTypes = {
  name: PropTypes.string
};

export default Icon;
