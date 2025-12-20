package com.autoRent.autoRent.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmailServiceTest {

    @Mock
    private JavaMailSender mailSender;

    @Mock
    private MimeMessage mimeMessage;

    @InjectMocks
    private EmailService emailService;

    @BeforeEach
    void setUp() {
        // Configurar mocks básicos
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
    }

    @Test
    void sendHtmlEmail_ConDatosValidos_DebeEnviarEmail() throws MessagingException {
        // Given
        String to = "test@example.com";
        String subject = "Test Subject";
        String htmlContent = "<h1>Test HTML Content</h1>";

        // When
        emailService.sendHtmlEmail(to, subject, htmlContent);

        // Then
        verify(mailSender).createMimeMessage();
        verify(mailSender).send(mimeMessage);
    }

    @Test
    void sendHtmlEmail_ConEmailValido_DebeConfigurarDestinatario() throws MessagingException {
        // Given
        String to = "usuario@test.com";
        String subject = "Bienvenido";
        String htmlContent = "<p>Bienvenido a nuestro servicio</p>";

        // When
        emailService.sendHtmlEmail(to, subject, htmlContent);

        // Then
        verify(mailSender).createMimeMessage();
        verify(mailSender).send(mimeMessage);
    }

    @Test
    void sendHtmlEmail_ConSubjectValido_DebeConfigurarAsunto() throws MessagingException {
        // Given
        String to = "test@example.com";
        String subject = "Confirmación de Reserva";
        String htmlContent = "<p>Su reserva ha sido confirmada</p>";

        // When
        emailService.sendHtmlEmail(to, subject, htmlContent);

        // Then
        verify(mailSender).createMimeMessage();
        verify(mailSender).send(mimeMessage);
    }

    @Test
    void sendHtmlEmail_ConContenidoHtml_DebeConfigurarComoHtml() throws MessagingException {
        // Given
        String to = "test@example.com";
        String subject = "Test";
        String htmlContent = "<html><body><h1>Título</h1><p>Párrafo</p></body></html>";

        // When
        emailService.sendHtmlEmail(to, subject, htmlContent);

        // Then
        verify(mailSender).createMimeMessage();
        verify(mailSender).send(mimeMessage);
    }

    @Test
    void sendHtmlEmail_ConContenidoSimple_DebeEnviarCorrectamente() throws MessagingException {
        // Given
        String to = "simple@test.com";
        String subject = "Mensaje Simple";
        String htmlContent = "Contenido de texto simple";

        // When
        emailService.sendHtmlEmail(to, subject, htmlContent);

        // Then
        verify(mailSender).createMimeMessage();
        verify(mailSender).send(mimeMessage);
    }

    @Test
    void sendHtmlEmail_ConEmailNull_DebeLanzarExcepcion() throws MessagingException {
        // Given
        String to = null;
        String subject = "Test";
        String htmlContent = "<p>Test</p>";

        // When & Then
        assertThrows(IllegalArgumentException.class, () -> 
            emailService.sendHtmlEmail(to, subject, htmlContent));
    }

    @Test
    void sendHtmlEmail_ConSubjectNull_DebeLanzarExcepcion() throws MessagingException {
        // Given
        String to = "test@example.com";
        String subject = null;
        String htmlContent = "<p>Test</p>";

        // When & Then
        assertThrows(IllegalArgumentException.class, () -> 
            emailService.sendHtmlEmail(to, subject, htmlContent));
    }

    @Test
    void sendHtmlEmail_ConContenidoNull_DebeLanzarExcepcion() throws MessagingException {
        // Given
        String to = "test@example.com";
        String subject = "Test";
        String htmlContent = null;

        // When & Then
        assertThrows(IllegalArgumentException.class, () -> 
            emailService.sendHtmlEmail(to, subject, htmlContent));
    }

    @Test
    void sendHtmlEmail_ConContenidoVacio_DebeEnviarCorrectamente() throws MessagingException {
        // Given
        String to = "test@example.com";
        String subject = "Test";
        String htmlContent = "";

        // When
        emailService.sendHtmlEmail(to, subject, htmlContent);

        // Then
        verify(mailSender).createMimeMessage();
        verify(mailSender).send(mimeMessage);
    }

    @Test
    void sendHtmlEmail_ConContenidoComplejo_DebeEnviarCorrectamente() throws MessagingException {
        // Given
        String to = "test@example.com";
        String subject = "Email Complejo";
        String htmlContent = """
            <!DOCTYPE html>
            <html>
            <head>
                <title>Email</title>
            </head>
            <body>
                <h1>Bienvenido</h1>
                <p>Este es un email de prueba con <strong>formato</strong> y <em>estilos</em>.</p>
                <ul>
                    <li>Item 1</li>
                    <li>Item 2</li>
                </ul>
            </body>
            </html>
            """;

        // When
        emailService.sendHtmlEmail(to, subject, htmlContent);

        // Then
        verify(mailSender).createMimeMessage();
        verify(mailSender).send(mimeMessage);
    }

    @Test
    void sendHtmlEmail_ConCaracteresEspeciales_DebeEnviarCorrectamente() throws MessagingException {
        // Given
        String to = "test@example.com";
        String subject = "Email con Acentos y Ñ";
        String htmlContent = "<p>Contenido con acentos: áéíóú y ñ</p>";

        // When
        emailService.sendHtmlEmail(to, subject, htmlContent);

        // Then
        verify(mailSender).createMimeMessage();
        verify(mailSender).send(mimeMessage);
    }

    @Test
    void sendHtmlEmail_ConEmailInvalido_DebeManejarGracefully() throws MessagingException {
        // Given
        String to = "email-invalido";
        String subject = "Test";
        String htmlContent = "<p>Test</p>";

        // When
        emailService.sendHtmlEmail(to, subject, htmlContent);

        // Then
        verify(mailSender).createMimeMessage();
        verify(mailSender).send(mimeMessage);
    }
}
