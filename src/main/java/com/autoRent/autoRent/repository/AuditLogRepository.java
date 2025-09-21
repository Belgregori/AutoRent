package com.autoRent.autoRent.repository;

import com.autoRent.autoRent.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> { }
