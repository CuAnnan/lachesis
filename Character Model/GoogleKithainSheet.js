import KithainSheet from './KithainSheet.js';

import {Art, Attribute, Background, Glamour, Knowledge, Realm, Skill, Talent, Trait, Willpower, Merit, Flaw} from "./Traits.js";

class GoogleKithainSheet extends KithainSheet
{
    static document = null;

    static getCellContent(row, col)
    {
        let cell = this.document.querySelector(`table tr:nth-child(${row}) td:nth-of-type(${col})`);
        return cell?.textContent.trim() ?? '';
    }

    static attributesFromRow(row, traitConstructor)
    {
        let tr = this.document.querySelector(`table tr:nth-child(${row})`);
        let cells = tr.querySelectorAll('td');
        let attributes = [];

        for(let i = 0; i < 3; i ++)
        {
            let offset = i * 7;
            attributes.push(this.extractTrait(traitConstructor, cells, offset));
        }
        return attributes;
    }

    static getTemperFromRow(row, temperConstructor)
    {
        let tr = this.document.querySelector(`table tr:nth-child(${row})`);
        let cells = tr.querySelectorAll('td');

        return new temperConstructor(
            Number(cells[10]?.textContent?.trim() ?? 0),
            Number(cells[11]?.textContent?.trim() ?? 0),
            Number(cells[12]?.textContent?.trim() ?? 0)
        );
    }

    static abilitiesFromRow(row)
    {
        let tr = this.document.querySelector(`table tr:nth-child(${row})`);
        let cells = tr.querySelectorAll('td');
        let talent = this.extractTrait(Talent, cells, 0);
        let skill = this.extractTrait(Skill, cells, 7);
        let knowledge = this.extractTrait(Knowledge, cells, 14);
        return [talent, skill, knowledge];
    }

    static advantagesFromRow(row)
    {
        let tr = this.document.querySelector(`table tr:nth-child(${row})`);
        let cells = tr.querySelectorAll('td');
        let background = this.extractTrait(Background, cells, 0);
        let art = this.extractTrait(Art, cells, 7);
        let realm = this.extractTrait(Realm, cells, 14);

        console.log(art);

        return [background, art, realm];
    }

    static meritsAndFlawsFromRow(row)
    {
        let tr = this.document.querySelector(`table tr:nth-child(${row})`);
        let cells = tr.querySelectorAll('td');
        let merit = this.extractTrait(Merit, cells, 0);
        let flaw = this.extractTrait(Flaw, cells, 7);
        return [merit, flaw];
    }

    static extractTrait(traitConstructor, cells, offset) {
        let name = cells[offset].textContent.replace(/\u00A0/g, ' ').trim()
        if(name === '') return null;
        let trait = new traitConstructor(
            name,
            Number(cells?.[3 + offset]?.textContent?.trim() ?? 0),
            Number(cells?.[4 + offset]?.textContent?.trim() ?? 0),
            Number(cells?.[5 + offset]?.textContent?.trim() ?? 0)
        );
        trait.setSpecialty(cells[offset + 1]?.textContent?.trim() ?? '');
        return trait;
    }

    static async fromGoogleSheetsURL(url, parseResponse)
    {
        let sheet = new this();

        if(url.includes("/edit"))
        {
            throw new Error("It looks like you're trying to import from the edit URL not the export URL.");
        }

        if(url.endsWith('pub?output=xlsx'))
        {
            url = url.replace(/pub\?output=xlsx$/, 'pubhtml');
        }
        url += '/sheet?headers=false&gid=0'

        let response = await fetch(url);
        let html = await response.text();

        this.document = parseResponse(html);


        //console.log(sheet);


        sheet.setKith(this.getCellContent(2, 9));
        sheet.setHouse(this.getCellContent(3, 5));
        sheet.name = this.getCellContent(1, 2);
        sheet.player = this.getCellContent(2, 2);
        sheet.chronicle = this.getCellContent(3, 2);
        sheet.court = this.getCellContent(1, 5);
        sheet.seeming = this.getCellContent(1, 8);
        sheet.legacies.seelie = this.getCellContent(2, 5);
        sheet.legacies.unseelie = this.getCellContent(2, 6);
        sheet.motley = this.getCellContent(3, 8);


        for(let i = 7; i < 10; i++)
        {
            let traits = this.attributesFromRow(i, Attribute);
            traits.forEach(trait => sheet.addTrait(trait));
        }

        for(let i = 13; i < 23; i++)
        {
            let [talent, skill, knowledge] = this.abilitiesFromRow(i);
            sheet.addTrait(talent);
            sheet.addTrait(skill);
            sheet.addTrait(knowledge);
        }

        for(let i = 26; i < 32; i++)
        {
            let [background, art, realm] = this.advantagesFromRow(i);
            if(background)
            {
                sheet.addTrait(background);
            }
            if(art)
            {
                sheet.addTrait(art);
            }
            if(realm)
            {
                if(realm.name === sheet.favouredRealm)
                {
                    realm.favoured = true;
                }
                sheet.addTrait(realm);
            }
        }

        for(let i = 36; i < 43; i++)
        {
            let [merit, flaw] = this.meritsAndFlawsFromRow(i);
            if(merit)
            {
                sheet.addTrait(merit);
            }
            if(flaw)
            {
                sheet.addTrait(flaw);
            }
        }



        sheet.addTrait(this.getTemperFromRow(44, Glamour));
        sheet.addTrait(this.getTemperFromRow(45, Willpower));
        sheet.addTrait(new Trait('Nightmare', this.getCellContent(46, 10)));
        sheet.addTrait(new Trait('Banality', this.getCellContent(47, 10)));

        sheet.finalize();

        return sheet;
    }
}

export default GoogleKithainSheet;