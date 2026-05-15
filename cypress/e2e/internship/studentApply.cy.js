describe('3. Отклик студента на стажировку', () => {
  
  beforeEach(() => {
    cy.login('student');
    cy.visit('/internships');
  });

  it('Успешная подача заявки на стажировку', () => {
    cy.get('.internship-item').each(($card) => {
      if ($card.find('.vacancy-page-card__button:contains("Откликнуться")').length) {
        cy.wrap($card).as('targetCard');
        return false;
      }
    });

    cy.get('@targetCard').contains('Подробнее').click();

    cy.get('button.vacancy-page-card__button')
      .contains('Откликнуться')
      .should('be.visible')
      .click();

    cy.get('body').then($body => {
      if ($body.find('.desktop-modal, .modal, [role="dialog"]').length) {
        cy.get('textarea[placeholder*="сопроводительное"], textarea[placeholder*="письмо"], .form-area')
          .first()
          .type('Здравствуйте! Заинтересован в прохождении стажировки. Готов выполнить тестовое задание.');

        cy.get('.desktop-modal, .modal').contains('Отправить').click();
      }
    });

    cy.get('.el-message--success, .alert-success, [class*="success"]', { timeout: 10000 })
      .should('be.visible');
    
    cy.contains('Вы уже откликнулись').should('be.visible');
  });

  it('Ошибка при повторном отклике', () => {
    cy.get('.internship-item').first().contains('Подробнее').click();

    cy.get('body').then($body => {
      const hasApplyBtn = $body.find('button:contains("Откликнуться"):not(:disabled)').length;
      const hasAlreadyApplied = $body.find(':contains("Вы уже откликнулись")').length;
      
      expect(hasApplyBtn === 0 || hasAlreadyApplied > 0).to.be.true;
    });
  });

  it('Ошибка при отправке пустого сопроводительного письма', () => {
    cy.get('.internship-item').each(($card) => {
      if ($card.find('.vacancy-page-card__button:contains("Откликнуться")').length) {
        cy.wrap($card).as('targetCard');
        return false;
      }
    });
    
    cy.get('@targetCard').contains('Подробнее').click();
    cy.get('button.vacancy-page-card__button').contains('Откликнуться').click();

    cy.get('body').then($body => {
      if ($body.find('.desktop-modal, .modal').length) {
        cy.get('.desktop-modal, .modal').contains('Отправить').click();

        cy.get('.el-message--error, .alert-danger, .form-error, .invalid-feedback', { timeout: 5000 })
          .should('exist');
      }
    });
  });
});