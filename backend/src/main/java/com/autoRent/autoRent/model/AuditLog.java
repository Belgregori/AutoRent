package com.autoRent.autoRent.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "actor_id", nullable = false)
    private Long actorId;

    @Column(name = "target_usuario_id", nullable = false)
    private Long targetUsuarioId;

    @Column(name = "action", nullable = false)
    private String action;

    @Lob
    @Column(name = "old_value")
    private String oldValue;

    @Lob
    @Column(name = "new_value")
    private String newValue;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public AuditLog() {}


    public AuditLog(Long actorId, Long targetUsuarioId, String action, String oldValue, String newValue) {
        this.actorId = actorId;
        this.targetUsuarioId = targetUsuarioId;
        this.action = action;
        this.oldValue = oldValue;
        this.newValue = newValue;
    }

    // getters / setters...
    public Long getId() { return id; }
    public Long getActorId() { return actorId; }
    public void setActorId(Long actorId) { this.actorId = actorId; }
    public Long getTargetUsuarioId() { return targetUsuarioId; }
    public void setTargetUsuarioId(Long targetUsuarioId) { this.targetUsuarioId = targetUsuarioId; }
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    public String getOldValue() { return oldValue; }
    public void setOldValue(String oldValue) { this.oldValue = oldValue; }
    public String getNewValue() { return newValue; }
    public void setNewValue(String newValue) { this.newValue = newValue; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
