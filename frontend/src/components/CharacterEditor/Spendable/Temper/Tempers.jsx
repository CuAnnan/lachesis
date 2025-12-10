import Col from 'react-bootstrap/Col';
import SpendableHeaderCol from "@CharacterEditor/Spendable/SpendableHeaderCol.jsx";
import Temper from "./Temper.jsx";

function Tempers({tempers, setTemper})
{
    if(tempers.Glamour)
    {
        return <>
            <Col className={`useGroup`} id={`group-tempers`}>
                <SpendableHeaderCol collapsed={false} nonCollapsible={true} title={"Tempers"} />
                <Temper temper={tempers.Glamour} setTemper={setTemper} costs={{xp:4, fp:3, cp:1}}/>
                <Temper temper={tempers.Willpower} setTemper={setTemper} costs={{xp:4, fp:1, cp:1}}/>
            </Col>
        </>
    }
    return (<></>);
}
export default Tempers;