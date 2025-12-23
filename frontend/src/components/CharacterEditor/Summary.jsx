import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import "./summary.css";

function Summary({summary = {}}) {

    // Build per-category totals from the summary object
    const categoryTotals = Object.entries(summary).map(([category, items]) => {
        // Ensure we always work with an array
        const arr = Array.isArray(items) ? items : (items ? [items] : []);
        // Flatten one level in case items themselves are arrays
        const flat = arr.flat ? arr.flat() : arr.reduce((acc, v) => acc.concat(v), []);

        const totals = flat.reduce(
            (tot, item) => ({
                fp: tot.fp + (item && item.fp ? item.fp : 0),
                xp: tot.xp + (item && item.xp ? item.xp : 0),
            }),
            { fp: 0, xp: 0 }
        );

        return { category, ...totals };
    });

    // Compute overall totals from category totals
    const totalSummary = categoryTotals.reduce(
        (tot, cat) => ({ fp: tot.fp + cat.fp, xp: tot.xp + cat.xp }),
        { fp: 0, xp: 0 }
    );

    return <>
        <h2>Summary</h2>
        <Row className="purchasable d-flex justify-content-center align-items-center">
            <Col md={8}></Col>
            <Col className="text-end summaryTitle">FP:</Col>
            <Col className="text-end summaryTitle">XP:</Col>
        </Row>

        {/* Per-category rows */}
        {categoryTotals.length === 0 && (
            <Row className="purchasable d-flex justify-content-center align-items-center">
                <Col className="summaryTitle" md={8}>No summary items</Col>
                <Col className="text-end">0</Col>
                <Col className="text-end">0</Col>
            </Row>
        )}

        {categoryTotals.map(({ category, fp, xp }) => (
            <Row key={category} className="purchasable d-flex justify-content-center align-items-center">
                <Col className="summaryTitle" md={8}>{category}:</Col>
                <Col className="text-end">{fp}</Col>
                <Col className="text-end">{xp}</Col>
            </Row>
        ))}

        <Row className="purchasable d-flex justify-content-center align-items-center">
            <Col className="summaryTitle" md={8}>Total:</Col>
            <Col className="text-end">{totalSummary.fp}</Col>
            <Col className="text-end">{totalSummary.xp}</Col>
        </Row>
    </>
}
export default Summary;