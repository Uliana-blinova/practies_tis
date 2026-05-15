describe('1. Создание стажировки работодателем', () => {
  
  beforeEach(() => {
    cy.login('employer');
  });
  it('Успешное создание стажировки с валидными данными', () => {
    cy.fixture('internshipData').then((data) => {
      cy.visit('/internships');
      cy.contains('Создать стажировку').click();
      cy.get('input[placeholder="Кладовщик"]').type(data.valid.title);

      cy.get('.form-select').eq(0).click(); 
      cy.contains('Дистант').click(); 

      cy.get('.form-select').eq(1).click(); 
      cy.contains('Да').click(); 

      cy.get('input[type="date"]').first().type('2026-06-01');

      cy.get('input[type="date"]').eq(1).type('2026-08-01');

      cy.get('textarea[placeholder="Ваши требования"]').type(data.valid.description);

      cy.get('textarea[placeholder="Обязанности сотрудника"]').type('Написание тестов, работа с Cypress');

      cy.get('button[type="submit"]').contains('Создать стажировку').click();

      cy.get('.el-message--success, .alert-success, [class*="success"]', { timeout: 10000 })
        .should('be.visible');

      cy.get('.desktop-modal').should('not.exist');
    });
  });

  it('Ошибка при создании стажировки с пустыми полями', () => {
    cy.visit('/internships');
    cy.contains('Создать стажировку').click();

    cy.get('button[type="submit"]').contains('Создать стажировку').click();

    cy.get('button[type="submit"]').should('be.disabled');

    cy.get('.el-message--error, .alert-danger, .form-error', { timeout: 5000 })
      .should('exist');
  });

  it('Ошибка при некорректных датах', () => {
    cy.visit('/internships');
    cy.contains('Создать стажировку').click();

    cy.get('input[placeholder="Кладовщик"]').type('Тестовая стажировка');

    cy.get('input[type="date"]').first().type('2026-08-01'); 
    cy.get('input[type="date"]').eq(1).type('2026-06-01');

    cy.get('button[type="submit"]').contains('Создать стажировку').click();

    cy.get('.el-message--error, .alert-danger, .form-error', { timeout: 5000 })
      .should('exist');
  });

  it('Кнопка "Создать" активируется после заполнения обязательных полей', () => {
    cy.visit('/internships');
    cy.contains('Создать стажировку').click();

    cy.get('button[type="submit"]').should('be.disabled');

    cy.get('input[placeholder="Кладовщик"]').type('Тест');

    cy.get('input[type="date"]').first().type('2026-06-01');
    cy.get('input[type="date"]').eq(1).type('2026-08-01');

    cy.get('button[type="submit"]').should('not.be.disabled');
  });
});