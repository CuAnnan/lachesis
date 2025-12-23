import Container from "react-bootstrap/Container";
function Instructions()
{
    return <Container>
        <h2>Instructions</h2>
        <p>The system doesn't constrain values to valid, so you will have to do your own sanity check with the book or someone who knows the system. But as a rule of thumb:</p>
        <ul>
            <li>Fill in creation points before freebies</li>
            <li>Fill in freebies before experience points</li>
            <li>Double click a relevant field to set a specialty</li>
            <li>Ctrl-click (Command Click on a mac) will delete a background, merit or flaw.</li>
            <li>Shift click to remame it. (WIP)</li>
        </ul>
    </Container>
}

export default Instructions;