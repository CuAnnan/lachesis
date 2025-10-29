import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {memo, Fragment} from "react";
import TraitDots from "./Traits/TraitDots.jsx";
import TraitBoxes from "./Traits/TraitBoxes.jsx";
import UseGroup from "./Traits/UseGroup.jsx";
import PersonalDetails from "./PersonalDetails.jsx";

function CharacterSheetStructure({sheet, isTraitSelected, toggleTrait})
{
    return <Fragment>
        <PersonalDetails sheet={sheet}/>
        <Row>
            <h2>Attributes</h2>
        </Row>
        <Row>
            {Object.entries(sheet.attributes).map(([useGroupName, useGroup]) => (
                <UseGroup
                    key={useGroupName}
                    useGroupName={useGroupName}
                    useGroup={useGroup}
                    isTraitSelected = {isTraitSelected}
                    toggleTrait = {toggleTrait}
                />
            ))}
        </Row>
        <Row>
            <h2>Abilities</h2>
        </Row>
        <Row>
            {Object.entries(sheet.abilities).map(([useGroupName, useGroup]) => (
                <UseGroup
                    key={useGroupName}
                    useGroupName={useGroupName}
                    useGroup={useGroup}
                    isTraitSelected = {isTraitSelected}
                    toggleTrait = {toggleTrait}
                />
            ))}
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
                    />
                </Row>
                <Row>
                    <UseGroup
                        useGroupName="Merits"
                        useGroup={sheet.merits}
                        isTraitSelected = {isTraitSelected}
                        toggleTrait = {toggleTrait}
                    />
                </Row>
                <Row>
                    <UseGroup
                        useGroupName="Flaws"
                        useGroup={sheet.flaws}
                        isTraitSelected = {isTraitSelected}
                        toggleTrait = {toggleTrait}
                    />
                </Row>
            </Col>
            <Col className="useGroup">
                <UseGroup
                    useGroupName="Arts"
                    useGroup={Object.fromEntries(Object.entries(sheet.arts).filter(([,trait])=>(trait.level>0)))}
                    isTraitSelected = {isTraitSelected}
                    toggleTrait = {toggleTrait}
                    />
            </Col>
            <Col className="useGroup">
                <UseGroup
                    useGroupName="Realms"
                    useGroup={Object.fromEntries(Object.entries(sheet.realms).filter(([,trait])=>(trait.level>0)))}
                    isTraitSelected = {isTraitSelected}
                    toggleTrait = {toggleTrait}
                />
            </Col>
        </Row>
        <Row>
            <h2>Tempers</h2>
            <Col>

            </Col>
            <Col className="tempers">
                <Row><Col><h4>Glamour</h4></Col></Row>
                <Row><Col>
                    <TraitDots level={sheet.glamour.level} maxLevel={10}/>
                </Col></Row>
                <Row><Col>
                    <TraitBoxes level={sheet.glamour.level} maxLevel={10}/>
                </Col></Row>
            </Col>
            <Col>

            </Col>
        </Row>
    </Fragment>;
}
export default memo(CharacterSheetStructure);