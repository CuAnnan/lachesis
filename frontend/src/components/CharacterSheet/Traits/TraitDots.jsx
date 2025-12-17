import {memo} from 'react';

function TraitDots({ level = 0, maxLevel = 5 }) {
    console.log(Math.max(maxLevel,level), level, maxLevel);
    return (
        <>
            {Array.from({ length: Math.max(maxLevel,level) }).map((_, i) => (
                <i
                    key={i}
                    className={`trait bx ${i < level ? 'bxs-circle' : 'bx-circle'}`}
                />
            ))}
        </>
    );
}

export default memo(TraitDots);