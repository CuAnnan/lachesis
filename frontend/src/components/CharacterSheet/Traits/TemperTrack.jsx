import {memo} from 'react';

function TemperTrack({ level = 0}) {
    return (
        <>
            {Array.from({ length: 10 }).map((_, i) => (
                <i
                    key={i}
                    className={`trait bx ${i < level ? 'bxs-square' : 'bx-square'}`}
                />
            ))}
        </>
    );
}

export default memo(TemperTrack);