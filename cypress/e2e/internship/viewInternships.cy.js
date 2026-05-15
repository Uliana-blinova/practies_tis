describe('2. Просмотр стажировок (поиск и фильтр)', () => {
  
  beforeEach(() => {
    cy.login('student');
    cy.visit('/internships');
  });
  it('Успешный поиск стажировки по названию', () => {
    cy.get('input[placeholder="Название..."]').type('Проверка');
    cy.get('.search-input__button').click();
    cy.get('.internship-item').should('contain', 'Проверка');
  });

  it('Фильтрация стажировок по типу оплаты', () => {
    cy.get('input[name="salary-field-radio"][value="Да"]').check();

    cy.get('.internship-header__salary').should('contain', 'Оплачиваемая');
  });

  it('Фильтрация стажировок - неоплачиваемые', () => {
    cy.get('input[name="salary-field-radio"][value="Нет"]').check();

    cy.get('.internship-header__salary').should('contain', 'Неоплачиваемая');
  });

  it('Сброс фильтров', () => {
    cy.get('input[name="salary-field-radio"][value="Да"]').check();

    cy.contains('Сбросить фильтр').click();
    cy.get('input[name="salary-field-radio"][value="Да"]').should('not.be.checked');
    cy.get('input[name="salary-field-radio"][value="Нет"]').should('not.be.checked');
  });

  it('Отображение карточек стажировок', () => {
    cy.get('.internship-item').should('have.length.at.least', 1);
   
    cy.get('.internship-item').first().within(() => {
      cy.get('.internship-header__name').should('exist');
      cy.get('.internship-header__salary').should('exist');
      cy.get('.badge').should('exist');
      cy.contains('Подробнее').should('exist');
    });
  });

  it('Поиск несуществующей стажировки', () => {
    cy.get('input[placeholder="Название..."]').type('Несуществующая_Стажировка_999');
    cy.get('.search-input__button').click();
    
    cy.get('.internship-item').should('have.length', 0);
  });

  it('Пустой поиск (без ввода текста)', () => {
    cy.get('input[placeholder="Название..."]').clear();
    cy.get('.search-input__button').click();

    cy.get('.internship-item').should('have.length.at.least', 1);
  });
});