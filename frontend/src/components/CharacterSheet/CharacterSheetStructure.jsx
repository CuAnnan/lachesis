import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {memo, Fragment, useEffect, useState, useRef} from "react";
import Temper from "./Traits/Temper.jsx";
import UseGroup from "./Traits/UseGroup.jsx";
import PersonalDetails from "./PersonalDetails.jsx";
import {client} from '@inc/AxiosInterceptor.js';
import TemperTrack from "./Traits/TemperTrack.jsx";
import TraitDots from "./Traits/TraitDots.jsx"

function CharacterSheetStructure({sheet, nanoid, isTraitSelected, toggleTrait})
{
    const [qrCode, setQrCode] = useState(null);
    const [filledHealthIndex, setFilledHealthIndex] = useState(-1);
    const tempersRef = useRef(null);

    useEffect(()=>{
        if(!nanoid) return;
        let mounted = true;
        let objectURL = null;
        client.get(`/sheets/${nanoid}/qrCode`, {responseType: "blob"})
            .then(response=>{
                if(!mounted) return;
                objectURL = URL.createObjectURL(response.data);
                setQrCode(objectURL);
            });
        return ()=>{
            mounted = false;
            if(objectURL) URL.revokeObjectURL(objectURL);
        };
    }, [nanoid]);

    useEffect(()=>{
        // Print-time handler: if the tempers row would be split, force it to start on a new page
        const el = tempersRef.current;
        if(!el) return;

        function handleBeforePrint(){
            try{
                const rect = el.getBoundingClientRect();
                const pageHeight = window.innerHeight || document.documentElement.clientHeight;
                // If the bottom of the tempers row would be below the printable viewport, force a break before it.
                if(rect.bottom > pageHeight - 10) { // small safety margin
                    el.classList.add('force-break-before');
                } else {
                    el.classList.remove('force-break-before');
                }
            } catch { void 0; }
        }

        function handleAfterPrint(){
            el.classList.remove('force-break-before');
        }

        window.addEventListener('beforeprint', handleBeforePrint);
        window.addEventListener('afterprint', handleAfterPrint);

        // Some browsers support matchMedia('print') events instead
        let mql = null;
        if(window.matchMedia){
            try{
                mql = window.matchMedia('print');
                if(typeof mql.addEventListener === 'function'){
                    mql.addEventListener('change', (ev)=>{
                        if(ev.matches) handleBeforePrint(); else handleAfterPrint();
                    });
                } else if(typeof mql.addListener === 'function'){
                    mql.addListener((ev)=>{
                        if(ev.matches) handleBeforePrint(); else handleAfterPrint();
                    });
                }
            } catch { void 0; }
        }

        // Run once in case the current viewport is the print preview (some UIs show print preview without firing beforeprint)
        // handleBeforePrint(); // don't run automatically to avoid altering UI during normal view

        return ()=>{
            window.removeEventListener('beforeprint', handleBeforePrint);
            window.removeEventListener('afterprint', handleAfterPrint);
            if(mql){
                try{
                    if(typeof mql.removeEventListener === 'function') mql.removeEventListener('change', handleBeforePrint);
                    else if(typeof mql.removeListener === 'function') mql.removeListener(handleBeforePrint);
                } catch { void 0; }
            }
        };
    }, []);

    const healthLevels = {"Unbruised":sheet.kith==="Troll"?(sheet.secondOathSworn?5:3):1, "-1":2, "-2":2, "Crippled":1, "Incapacitated":1};

    // Build ordered groups and assign a global index to each box so clicks can fill up to that index
    const orderedLevelKeys = ["Unbruised", "-1", "-2", "Crippled", "Incapacitated"];
    let global = 0;
    const groupedHealth = orderedLevelKeys.map(level => {
        const count = healthLevels[level] || 0;
        const boxes = Array.from({length: count}).map((_, i) => {
            return { level, localIndex: i, globalIndex: global++ };
        });
        return { level, boxes };
    });

    function handleHealthClick(index) {
        // If clicking an empty box (index > filledHealthIndex) fill up to it.
        // If clicking a filled box, decrease by one (toggle-like behavior).
        if (index > filledHealthIndex) {
            setFilledHealthIndex(index);
        } else if (index === filledHealthIndex) {
            setFilledHealthIndex(index - 1);
        } else {
            setFilledHealthIndex(index);
        }
    }

    return <Fragment>
        <PersonalDetails sheet={sheet}/>
        <Row>
            <h2>Attributes</h2>
        </Row>
        <Row className="traitGroup">
            <UseGroup
                key="physical"
                useGroupName="Physical"
                useGroup={sheet.attributes.physical}
                isTraitSelected = {isTraitSelected}
                toggleTrait = {toggleTrait}
            />
            <UseGroup
                key="social"
                useGroupName="Social"
                useGroup={sheet.attributes.social}
                isTraitSelected = {isTraitSelected}
                toggleTrait = {toggleTrait}
            />
            <UseGroup
                key="mental"
                useGroupName="Mental"
                useGroup={sheet.attributes.mental}
                isTraitSelected = {isTraitSelected}
                toggleTrait = {toggleTrait}
            />
        </Row>
        <Row>
            <h2>Abilities</h2>
        </Row>
        <Row className="traitGroup">
            <UseGroup
                key="talents"
                useGroupName="Talents"
                useGroup={sheet.abilities.talents}
                isTraitSelected = {isTraitSelected}
                toggleTrait = {toggleTrait}/>
            <UseGroup
                key="skills"
                useGroupName="Skills"
                useGroup={sheet.abilities.skills}
                isTraitSelected = {isTraitSelected}
                toggleTrait = {toggleTrait}/>
            <UseGroup
                key="knowledges"
                useGroupName="Knowledges"
                useGroup={sheet.abilities.knowledges}
                isTraitSelected = {isTraitSelected}
                toggleTrait = {toggleTrait}/>
        </Row>
        <Row>
            <h2>Advantages</h2>
        </Row>
        <Row>
            <Col className="useGroup">
                <Row>
                    <UseGroup
                        useGroupName="Backgrounds"
                        useGroup={sheet.backgrounds}
                        isTraitSelected = {isTraitSelected}
                        toggleTrait = {toggleTrait}
                        flexible={false}
                    />
                </Row>
                <Row>
                    <UseGroup
                        useGroupName="Merits"
                        useGroup={sheet.merits}
                        isTraitSelected = {isTraitSelected}
                        toggleTrait = {toggleTrait}
                        flexible={false}
                    />
                </Row>
                <Row>
                    <UseGroup
                        useGroupName="Flaws"
                        useGroup={sheet.flaws}
                        isTraitSelected = {isTraitSelected}
                        toggleTrait = {toggleTrait}
                        flexible={false}
                    />
                </Row>
            </Col>
            <Col className="useGroup">
                <UseGroup
                    useGroupName="Arts"
                    useGroup={Object.fromEntries(Object.entries(sheet.arts).filter(([,trait])=>(trait.level>0)))}
                    isTraitSelected = {isTraitSelected}
                    toggleTrait = {toggleTrait}
                    flexible={false}
                />
            </Col>
            <Col className="useGroup">
                <UseGroup
                    useGroupName="Realms"
                    useGroup={Object.fromEntries(Object.entries(sheet.realms).filter(([,trait])=>(trait.level>0)))}
                    isTraitSelected = {isTraitSelected}
                    toggleTrait = {toggleTrait}
                    flexible={false}
                />
            </Col>
        </Row>
        <Row className="tempersRow" ref={tempersRef}>
            <h2>Tempers</h2>
            <Col>
                { qrCode && <img src={qrCode} alt="QR Code"/>}
            </Col>
            <Col className="tempers">
                <Temper temper={sheet.tempers.glamour}/>
                <Temper temper={sheet.tempers.willpower}/>
                <Row><Col>
                    <strong>Banality</strong>
                </Col></Row>
                <Row><Col>
                    <TraitDots level={sheet.banality || 3} maxLevel={10}/>
                </Col></Row>
                <Row><Col>
                    <TemperTrack temper={sheet.temporaryBanality}/>
                </Col></Row>
                <Row><Col>
                    <strong>Nightmare</strong>
                </Col></Row>
                <Row><Col>
                    <TemperTrack temper={sheet.nightmare}/>
                </Col></Row>
            </Col>
            <Col>
                <Row><Col>
                    <h4>Health levels</h4>
                </Col></Row>
                {groupedHealth.map(({level, boxes}) =>
                    boxes.map((box, i) => (
                        <Row key={level + "-" + i} className="healthLevel">
                            <Col>{level}</Col>
                            <Col className="text-end">
                                <i
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => handleHealthClick(box.globalIndex)}
                                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleHealthClick(box.globalIndex); }}
                                    className={`traitBox trait bx ${box.globalIndex <= filledHealthIndex ? "bxs-square" : "bx-square"}`}
                                    style={{ cursor: "pointer" }}
                                    aria-pressed={box.globalIndex <= filledHealthIndex}
                                ></i>
                            </Col>
                        </Row>
                    ))
                )}
            </Col>
        </Row>
    </Fragment>;
}
export default memo(CharacterSheetStructure);