import React from "react";

import Mark from "../Mark";

export function axisPieces({
  renderMode = () => undefined,
  padding = 5,
  tickValues,
  scale,
  ticks,
  orient = "left",
  size,
  margin = { left: 0, right: 0, top: 0, bottom: 0 },
  footer = false
}) {
  //returns x1 (start of line), x2 (end of line) associated with the value of the tick
  let axisDomain = [],
    position1,
    position2,
    domain1,
    domain2,
    tposition1,
    tposition2,
    textPositionMod = 0,
    textPositionMod2 = 0,
    defaultAnchor = "middle";
  switch (orient) {
    case "top":
      position1 = "x1";
      position2 = "x2";
      domain1 = "y1";
      domain2 = "y2";
      axisDomain = footer
        ? [10, margin.top]
        : [margin.top, size[1] + margin.top];
      tposition1 = "tx";
      tposition2 = "ty";
      textPositionMod -= 20 - padding;
      break;
    case "bottom":
      position1 = "x1";
      position2 = "x2";
      domain1 = "y2";
      domain2 = "y1";
      axisDomain = footer
        ? [size[1] + margin.top + 10, size[1] + margin.top]
        : [size[1] + margin.top, margin.top];
      tposition1 = "tx";
      tposition2 = "ty";
      textPositionMod += 20 + padding;
      break;
    case "right":
      position1 = "y2";
      position2 = "y1";
      domain1 = "x2";
      domain2 = "x1";
      axisDomain = footer
        ? [size[0] + margin.left, size[0] + margin.left + 10]
        : [size[0] + margin.left, margin.left];
      tposition1 = "ty";
      tposition2 = "tx";
      textPositionMod += 5 + padding;
      textPositionMod2 += 5;
      defaultAnchor = "start";
      break;
    //left
    default:
      position1 = "y1";
      position2 = "y2";
      domain1 = "x1";
      domain2 = "x2";
      axisDomain = footer
        ? [margin.left - 10, margin.left]
        : [margin.left, size[0] + margin.left];
      tposition1 = "ty";
      tposition2 = "tx";
      textPositionMod -= 5 + padding;
      textPositionMod2 += 5;
      defaultAnchor = "end";
      break;
  }

  const axisSize = Math.abs(scale.range()[1] - scale.range()[0]);

  if (!tickValues) {
    if (!ticks) {
      ticks = Math.max(1, parseInt(axisSize / 40));
    }
    tickValues = scale.ticks(ticks);
  }

  return tickValues.map((tick, i) => {
    const tickPosition = scale(tick);
    return {
      [position1]: tickPosition,
      [position2]: tickPosition,
      [domain1]: axisDomain[0],
      [domain2]: axisDomain[1],
      [tposition1]: tickPosition + textPositionMod2,
      [tposition2]: axisDomain[0] + textPositionMod,
      defaultAnchor,
      renderMode: renderMode(tick, i),
      value: tick
    };
  });
}

export const axisLabels = ({ axisParts, orient, tickFormat, rotate = 0 }) => {
  return axisParts.map((axisPart, i) => {
    let renderedValue = tickFormat(axisPart.value);
    if (typeof renderedValue !== "object" || renderedValue instanceof Date) {
      renderedValue = (
        <text textAnchor={axisPart.defaultAnchor}>
          {renderedValue.toString ? renderedValue.toString() : renderedValue}
        </text>
      );
    }

    return (
      <g
        key={i}
        pointerEvents="none"
        transform={`translate(${axisPart.tx},${axisPart.ty})rotate(${rotate})`}
      >
        {renderedValue}
      </g>
    );
  });
};

export const axisLines = ({ axisParts, orient }) => {
  return axisParts.map((axisPart, i) => (
    <Mark
      key={i}
      markType="path"
      renderMode={axisPart.renderMode}
      stroke="black"
      strokeWidth="1px"
      simpleInterpolate={true}
      d={`M${axisPart.x1},${axisPart.y1}L${axisPart.x2},${axisPart.y2}`}
      className={`tick-line tick ${orient}`}
    />
  ));
};
