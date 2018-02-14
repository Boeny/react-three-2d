import * as React from 'react';
import { Euler, Color, VertexColors, Vector3 } from 'three';


interface Props extends CommonProps {
    r1: GetRadius;
    r2: GetRadius;
}

export function BaseRing(props: Props) {
    const { angle, color, r1, r2 } = props;
    return (
        <mesh rotation={new Euler(0, 0, angle || 0)}>
            <parametricGeometry
                parametricFunction={parametric(r1, r2)}
                slices={40}
                stacks={1}
            />
            <meshBasicMaterial
                wireframe={true}
                color={new Color(color || 'white')}
                vertexColors={VertexColors}
            />
        </mesh>
    );
}


interface CommonProps {
    angle?: number;
    color?: string;
}

interface CircleProps extends CommonProps {
    radius: number;
}

interface EllipseProps extends CircleProps {
    radius2: number;
}

interface InnerRingProps extends CircleProps {
    innerRadius: number;
}

interface WidthRingProps extends CircleProps {
    width: number;
}


export function Circle(props: CircleProps) {
    const func = getRadius(props.radius);
    return (
        <BaseRing
            r1={func}
            r2={func}
            angle={props.angle}
            color={props.color}
        />
    );
}

export function WidthRing(props: WidthRingProps) {
    const func = getRadiusByWidth(props.radius, props.width);
    return (
        <BaseRing
            r1={func}
            r2={func}
            angle={props.angle}
            color={props.color}
        />
    );
}

export function InnerRing(props: InnerRingProps) {
    const func = getRadiusByInner(props.radius, props.innerRadius);
    return (
        <BaseRing
            r1={func}
            r2={func}
            angle={props.angle}
            color={props.color}
        />
    );
}


export function Ellipse(props: EllipseProps) {
    return (
        <BaseRing
            r1={getRadius(props.radius)}
            r2={getRadius(props.radius2)}
            angle={props.angle}
            color={props.color}
        />
    );
}

export function WidthEllipseRing(props: EllipseProps & WidthRingProps) {
    return (
        <BaseRing
            r1={getRadiusByWidth(props.radius, props.width)}
            r2={getRadiusByWidth(props.radius2, props.width)}
            angle={props.angle}
            color={props.color}
        />
    );
}

export function InnerEllipseRing(props: EllipseProps & InnerRingProps) {
    return (
        <BaseRing
            r1={getRadiusByInner(props.radius, props.innerRadius)}
            r2={getRadiusByInner(props.radius2, props.innerRadius)}
            angle={props.angle}
            color={props.color}
        />
    );
}


type GetRadius = (coo: number) => number;

const getRadius: (r: number) => GetRadius = radius => coo => {
    return radius * coo;
};

const getRadiusByInner: (r: number, inner: number) => GetRadius = (radius, innerRadius) => coo => {
    return (radius - innerRadius) * coo + innerRadius;
};

const getRadiusByWidth: (r: number, width: number) => GetRadius = (radius, width) => coo => {
    return width * coo + radius - width;
};


type Parametric = (u: number, v: number) => Vector3;

const parametric: (r1: GetRadius, r2: GetRadius) => Parametric = (radius1, radius2) => (u, v) => {
    return pointInTheEllipse(radius1(v), radius2(v), 2 * u * Math.PI);
};

function pointInTheEllipse(r1: number, r2: number, angle: number): Vector3 {
    return new Vector3(
        r1 * Math.cos(angle),
        r2 * Math.sin(angle),
        0
    );
}
