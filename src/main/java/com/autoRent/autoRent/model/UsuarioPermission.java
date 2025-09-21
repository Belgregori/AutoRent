package com.autoRent.autoRent.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "usuario_permissions",
        uniqueConstraints = @UniqueConstraint(columnNames = {"usuario_id", "permission_id"}))
public class UsuarioPermission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;

    @Column(name = "permission_id", nullable = false)
    private Long permissionId;

    @Column(name = "granted_by")
    private Long grantedBy;

    @Column(name = "granted_at")
    private LocalDateTime grantedAt = LocalDateTime.now();

    // relación opcional para facilitar queries (read-only desde aquí)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "permission_id", insertable = false, updatable = false)
    private Permission permission;

    public UsuarioPermission() {}
    public UsuarioPermission(Long usuarioId, Long permissionId, Long grantedBy) {
        this.usuarioId = usuarioId;
        this.permissionId = permissionId;
        this.grantedBy = grantedBy;
    }

    // getters / setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
    public Long getPermissionId() { return permissionId; }
    public void setPermissionId(Long permissionId) { this.permissionId = permissionId; }
    public Long getGrantedBy() { return grantedBy; }
    public void setGrantedBy(Long grantedBy) { this.grantedBy = grantedBy; }
    public LocalDateTime getGrantedAt() { return grantedAt; }
    public void setGrantedAt(LocalDateTime grantedAt) { this.grantedAt = grantedAt; }
    public Permission getPermission() { return permission; }
}
