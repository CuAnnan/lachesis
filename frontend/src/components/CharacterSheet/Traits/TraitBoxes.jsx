import {memo} from 'react';

function TraitBoxes({ level = 0, maxLevel = 5 }) {
    return (
        <>
            {Array.from({ length: maxLevel }).map((_, i) => (
                <i
                    key={i}
                    className={`trait bx ${i < level ? 'bx-square' : 'bxs-square'}`}
                />
            ))}
        </>
    );
}

export default memo(TraitBoxes);