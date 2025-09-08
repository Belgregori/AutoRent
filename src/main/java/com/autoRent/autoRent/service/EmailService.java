package com.autoRent.autoRent.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

    @Service
    public class EmailService {

        @Autowired
        private JavaMailSender mailSender;

        public void sendHtmlEmail(String to, String subject, String htmlContent) {
            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

                helper.setTo(to);
                helper.setSubject(subject);
                helper.setText(htmlContent, true); // ✅ true = HTML

                mailSender.send(message);
                System.out.println("Correo enviado a: " + to);
            } catch (MessagingException e) {
                System.err.println("Error enviando correo HTML: " + e.getMessage());
                e.printStackTrace();
            }
        }
    }

