import Container from "react-bootstrap/Container";
function Instructions()
{
    return <Container>
        <p>The system doesn't constrain values to valid, so you will have to do your own sanity check with the book or someone who knows the system. But as a rule of thumb:</p>
        <ul>
            <li>Fill in creation points before freebies</li>
            <li>Fill in freebies before experience points</li>
            <li>Double click a relevant field to set a specialty (WIP)</li>
            <li>Ctrl-click will delete a background, merit or flaw. Shift click to remame it. (WIP)</li>
        </ul>
    </Container>
}

export default Instructions;