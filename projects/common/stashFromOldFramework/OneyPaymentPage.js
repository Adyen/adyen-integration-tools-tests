import {Selector, t, ClientFunction} from "testcafe";

export default class OneyPaymentPage {

    oneyBuyButton = Selector('input[type="submit"]');
    oneyCiviliteSelect = Selector('#civilite');
    oneyJourNaissanceSelect = Selector('#jourNaissance');
    oneyMoisNaissanceSelect = Selector('#moisNaissance');
    oneyAnneeNaissanceSelect = Selector('#anneeNaissance');
    oneyVillenaissanceInput = Selector('input[name="villenaissance"]');
    oneyDepartementNaissanceSelect = Selector('#departement-naissance');
    oneyTitulaireInput = Selector('#titulaire');
    oneyCreditCardInput = Selector('#creditCard');
    oneyCardDateInput = Selector('#card-date');
    oneyCryptogrammeInput = Selector('#cryptogramme');
    oneyConditionsgenCheckbox = Selector('#conditionsgen');

    continueOnOney = async (userData, card) => {
        const oneyBuyButton = await this.oneyBuyButton.with({visibilityCheck: true})();
        await t.click(this.oneyCiviliteSelect()).click(this.oneyCiviliteSelect().child(1))
            .click(this.oneyJourNaissanceSelect()).click(this.oneyJourNaissanceSelect().child(1))
            .click(this.oneyMoisNaissanceSelect()).click(this.oneyMoisNaissanceSelect().child(1))
            .click(this.oneyAnneeNaissanceSelect()).click(this.oneyAnneeNaissanceSelect().child(1))
            .typeText(this.oneyVillenaissanceInput(), userData.city).pressKey("down enter")
            .click(this.oneyDepartementNaissanceSelect()).click(this.oneyDepartementNaissanceSelect().withText(userData.city))
            .typeText(this.oneyTitulaireInput(), [userData.firstName, userData.lastName].join(' '))
            .typeText(this.oneyCreditCardInput(), card[0])
            .typeText(this.oneyCardDateInput(), card[2])
            .typeText(this.oneyCryptogrammeInput(), card[1])
            .click(this.oneyConditionsgenCheckbox())
            .click(oneyBuyButton)
            .wait(12000);
    }
}
