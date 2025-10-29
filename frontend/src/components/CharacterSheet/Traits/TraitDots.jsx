import {memo} from 'react';

function TraitDots({ level = 0, maxLevel = 5 }) {
    return (
        <>
            {Array.from({ length: maxLevel }).map((_, i) => (
                <i
                    key={i}
                    className={`trait bx ${i < level ? 'bxs-circle' : 'bx-circle'}`}
                />
            ))}
        </>
    );
}

export default memo(TraitDots);