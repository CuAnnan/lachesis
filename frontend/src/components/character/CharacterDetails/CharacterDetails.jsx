import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";

const courts = ["Seelie", "Unseelie"];
const legacies = {
    "seelie":["Bumpkin", "Courtier", "Crafter", "Dandy", "Hermit", "Orchid", "Paladin", "Panderer", "Regent", "Sage", "Saint", "Squire", "Troubadour", "Wayfarer"],
    "unseelie":["Beast", "Fatalist", "Fool", "Grotesque", "Knave", "Outlaw", "Pandora", "Peacock", "Rake", "Riddler", "Ringleader", "Rogue", "Savage", "Wretch"]
};
const houses = ["Aesin", "Ailil", "Balor", "Beaumayn", "Danaan", "Daireann", "Dougal", "Eiluned", "Fiona", "Gwydion", "Leanhaun", "Liam", "Scathach", "Varich"];
const seemings = ["Childing", "Wilder", "Grump"];
const kiths=["Boggan", "Clurichaun", "Eshu", "Nocker", "Piskie", "Pooka", "Redcap", "Satyr", "Selkie", "Sidhe (Arcadian)", "Sidhe (Autumn)", "Sluagh", "Troll"];

function SelectFromFields({onChange, values, value})
{
    return <Form.Select
        onChange={onChange}
        value={value}>
        <option value="">- Choose one -</option>
        {values.map((value, idx)=>(<option key={idx} value={value}>{value}</option>))}
    </Form.Select>
}

function SimpleSelect({label, onChange, values, value})
{
    return <Row className="purchasable d-flex justify-content-center align-items-center">
        <Col sm={4}>{label}</Col>
        <Col>
            <SelectFromFields onChange={onChange} value={value ?? ""} values={values}/>
        </Col>
    </Row>
}

function SimpleInput({label, onChange, value})
{
    return <Row className="purchasable d-flex justify-content-center align-items-center">
        <Col sm={4}>{label}</Col>
        <Col>
            <Form.Control
                onChange={onChange}
                value={value ?? ""}/>
        </Col>
    </Row>
}

function CharacterDetails({state, updateCharacterDetail, updateLegacy})
{
    return<Row>
        <Col className="useGroup">
            <SimpleInput
                label="Name"
                onChange={(e)=>{
                    updateCharacterDetail("name", e.target.value);
                }}
                value={state.name}/>
            <SimpleInput
                label="Player"
                onChange={(e)=>{
                    updateCharacterDetail("player", e.target.value);
                }}
                value={state.player}/>
            <SimpleInput
                label="Chronicle"
                onChange={(e)=>{
                    updateCharacterDetail("chronicle", e.target.value);
                }}
                value={state.chronicle}/>
        </Col>
        <Col className="useGroup">
            <SimpleSelect
                onChange={(e)=>{
                    updateCharacterDetail("court", e.target.value);
                }}
                value={state.court}
                values={courts}
                label="Court"
            />
            <Row className="purchasable d-flex justify-content-center align-items-center">
                <Col sm={4}>Legacies</Col>
                <Col sm={4}>
                    <SelectFromFields
                        onChange={(e)=>{
                            updateLegacy("seelie", e.target.value);
                        }}
                        value={state.legacies.seelie}
                        values={legacies.seelie}/>
                </Col>
                <Col sm={4}>
                    <SelectFromFields
                        onChange={(e)=>{
                            updateLegacy("unseelie", e.target.value);
                        }}
                        value={state.legacies.unseelie}
                        values={legacies.unseelie}/>
                </Col>
            </Row>
            <SimpleSelect
                label="House"
                onChange={(e)=>{
                    updateCharacterDetail("house", e.target.value);
                }}
                value={state.house}
                values={houses}
            />
        </Col>
        <Col className="useGroup">
            <SimpleSelect
                label="Seeming"
                onChange={(e)=>{
                    updateCharacterDetail("seeming", e.target.value);
                }}
                value={state.seeming}
                values={seemings}
                />
            <SimpleSelect
                label="Kith"
                onChange={(e)=>{
                    updateCharacterDetail("kith", e.target.value);
                }}
                value={state.kith}
                values={kiths}
            />
            <SimpleInput
                onChange={(e)=>{updateCharacterDetail("motley", e.target.value)}}
                value={state.motley}
                label="Motley"
            />
        </Col>
    </Row>;
}


export default CharacterDetails;