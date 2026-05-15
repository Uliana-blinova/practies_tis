describe('5. Взаимодействие в рабочем пространстве', () => {
  
  beforeEach(() => {
    cy.login('employer');
    cy.visit('/workspace/1'); 
  });

  it('Успешная отправка сообщения в рабочем пространстве', () => {
    cy.get('textarea[placeholder="Напишите комментарий..."], .form-area')
      .type('Приглашаю на собеседование');
    
    cy.get('.send-message-icon, .icon-button').last().click();

    cy.get('.comment-message__text').should('contain', 'Приглашаю на собеседование');
    
    cy.get('textarea[placeholder="Напишите комментарий..."], .form-area')
      .should('have.value', '');
  });

  it('Успешная загрузка файла в рабочем пространстве', () => {
    const fileName = 'test.txt';
    const fileContent = 'Тестовый файл для стажировки';

    cy.get('textarea[placeholder="Напишите комментарий..."], .form-area')
      .type('Отправляю тестовое задание');

    cy.get('input[type="file"], .form-input--file').attachFile({
      fileContent,
      fileName,
      mimeType: 'text/plain'
    });

    cy.get('.send-message-icon, .icon-button').last().click();

    cy.get('.base-comment').last().should('contain', 'Отправляю тестовое задание');
  });

  it('Успешный ответ на комментарий', () => {
    cy.contains('Ответить').first().click();

    cy.get('textarea[placeholder="Напишите комментарий..."], .form-area')
      .type('Хорошо, жду звонка');

    cy.get('.send-message-icon, .icon-button').last().click();

    cy.get('.comment-message__text').should('contain', 'Хорошо, жду звонка');
  });


  it('Ошибка при отправке пустого сообщения', () => {
    cy.get('.send-message-icon, .icon-button').last().click();

    cy.get('textarea[placeholder="Напишите комментарий..."], .form-area')
      .should('have.value', '');

    cy.get('.el-message--error, .alert-danger, .form-error', { timeout: 3000 })
      .should('exist');
  });

  it('Ошибка при отправке слишком длинного сообщения', () => {
    const longText = 'A'.repeat(1001);
    
    cy.get('textarea[placeholder="Напишите комментарий..."], .form-area')
      .type(longText);

    cy.get('.send-message-icon, .icon-button').last().click();

    cy.get('.el-message--error, .alert-danger, .form-error', { timeout: 5000 })
      .should('exist');
  });
});