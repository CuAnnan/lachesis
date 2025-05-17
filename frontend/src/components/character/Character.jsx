import {useState, useEffect} from 'react';
import {Button, Row, Col, Container} from 'react-bootstrap';
import {client} from '../../AxiosInterceptor.js';



function Character()
{
    const [name, setName] = useState('');
    const [player, setPlayer] = useState('');
    const [chronicle, setChronicle] = useState('');
    const [court, setCourt] = useState('');
    const [seelieLegacy, setSeelieLegacy] = useState('');
    const [unseelieLegacy, setUnseelieLegacy] = useState('');
    const [house, setHouse] = useState('');
    const [seeming, setSeeming] = useState('');
    const [kith, setKith] = useState('');
    const [motley, setMotley] = useState('');

}