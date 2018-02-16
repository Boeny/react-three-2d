import * as React from 'react';
import { Vector3 } from 'three';
import { pointInTheEllipse } from '~/utils';
import { Parametric } from './parametric';


interface Props extends CommonProps {
    r1: GetRadius;
    r2: GetRadius;
}

export function BaseRing(props: Props) {
    const { r1, r2, ...common } = props;
    return (
        <Parametric
            {...common}
            slices={40}
            stacks={1}
            parametricFunction={parametric(r1, r2)}
        />
    );
}


interface CommonProps extends PositionProps {
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
            position={props.position}
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
            position={props.position}
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
            position={props.position}
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
            position={props.position}
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
            position={props.position}
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
            position={props.position}
        />
    );
}


type GetRadius = (coo: number) => number;

const getRadius: (r: number) => GetRadius = radius => coo => {
    return radius * coo;
};


type GetRadiusBy = (radius: number, param: number) => GetRadius;

const getRadiusByInner: GetRadiusBy  = (radius, innerRadius) => coo => {
    return (radius - innerRadius) * coo + innerRadius;
};

const getRadiusByWidth: GetRadiusBy = (radius, width) => coo => {
    return width * coo + radius - width;
};


type Parametric = (u: number, v: number) => Vector3;

const parametric: (r1: GetRadius, r2: GetRadius) => Parametric = (radius1, radius2) => (u, v) => {
    return pointInTheEllipse(radius1(v), radius2(v), 2 * u * Math.PI);
};
