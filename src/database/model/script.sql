/*==============================================================*/
/* DBMS name:      PostgreSQL 8                                 */
/* Created on:     26/12/2022 17:56:03                          */
/*==============================================================*/

/*==============================================================*/
/* Table: BIENES                                                */
/*==============================================================*/
create table BIENES (
   IDBIEN               SERIAL               not null,
   NOMBREBIEN           VARCHAR(100)         not null,
   CODIGOBIEN           VARCHAR(10)          not null,
   CANTIDADBIEN         NUMERIC(6)           not null,
   CATEGORIABIEN        VARCHAR(10)          not null,
   OBSERVACIONBIEN      VARCHAR(200)         not null,
   constraint PK_BIENES primary key (IDBIEN)
);

/*==============================================================*/
/* Index: BIENES_PK                                             */
/*==============================================================*/
create unique index BIENES_PK on BIENES (
IDBIEN
);

/*==============================================================*/
/* Table: CLIENTES                                              */
/*==============================================================*/
create table CLIENTES (
   IDCLIENTE            SERIAL               not null,
   RAZONSOCIALCLIENTE   VARCHAR(50)          not null,
   RUCCLIENTE           VARCHAR(15)          not null,
   CIUDADCLIENTE        VARCHAR(15)          not null,
   TELEFONOCLIENTE      VARCHAR(10)          not null,
   DIRECCIONCLIENTE     VARCHAR(200)         not null,
   NOMBRECONTACTOCLIENTE VARCHAR(50)          not null,
   TELEFONOCONTACTOCLIENTE VARCHAR(10)          not null,
   CORREOCONTACTOCLIENTE VARCHAR(75)          not null,
   OBSERVACIONCLIENTE   VARCHAR(200)         not null,
   constraint PK_CLIENTES primary key (IDCLIENTE)
);

/*==============================================================*/
/* Index: CLIENTES_PK                                           */
/*==============================================================*/
create unique index CLIENTES_PK on CLIENTES (
IDCLIENTE
);

/*==============================================================*/
/* Table: COSTOS                                                */
/*==============================================================*/
create table COSTOS (
   IDCOSTO              SERIAL               not null,
   ANALISISCOSTO        VARCHAR(100)         not null,
   CODIGOCOSTO          VARCHAR(10)          not null,
   TOTALCOSTO           NUMERIC(6)           not null,
   OBSERVACIONCOSTO     VARCHAR(200)         not null,
   constraint PK_COSTOS primary key (IDCOSTO)
);

/*==============================================================*/
/* Index: COSTOS_PK                                             */
/*==============================================================*/
create unique index COSTOS_PK on COSTOS (
IDCOSTO
);

/*==============================================================*/
/* Table: EMPRESA                                               */
/*==============================================================*/
create table EMPRESA (
   IDEMPRESA            SERIAL               not null,
   IMAGENEMPRESA        VARCHAR(250)         not null,
   NOMBREEMPRESA        VARCHAR(10)          not null,
   constraint PK_EMPRESA primary key (IDEMPRESA)
);

/*==============================================================*/
/* Index: EMPRESA_PK                                            */
/*==============================================================*/
create unique index EMPRESA_PK on EMPRESA (
IDEMPRESA
);

/*==============================================================*/
/* Table: FORMATOS                                              */
/*==============================================================*/
create table FORMATOS (
   IDFORMATO            SERIAL               not null,
   NOMBREARCHIVO        VARCHAR(100)         not null,
   TIPOFORMATO          VARCHAR(10)          not null,
   ENLACEFORMATO        VARCHAR(250)         not null,
   constraint PK_FORMATOS primary key (IDFORMATO)
);

/*==============================================================*/
/* Index: FORMATOS_PK                                           */
/*==============================================================*/
create unique index FORMATOS_PK on FORMATOS (
IDFORMATO
);

/*==============================================================*/
/* Table: INGRESOS                                              */
/*==============================================================*/
create table INGRESOS (
   IDINGRESO            SERIAL               not null,
   MUESTRAANALISISINGRESO VARCHAR(100)         not null,
   ENCARGADOINGRESO     VARCHAR(50)          not null,
   FECHAINGRESO         DATE                 not null,
   TIPOINGRESO          VARCHAR(15)          not null,
   COSTOINGRESO         NUMERIC(6)           not null,
   CANTIDADINGRESO      NUMERIC(6)           not null,
   TOTALINGRESO         NUMERIC(6)           not null,
   OBSERVACIONINGRESO   VARCHAR(200)         not null,
   constraint PK_INGRESOS primary key (IDINGRESO)
);

/*==============================================================*/
/* Index: INGRESOS_PK                                           */
/*==============================================================*/
create unique index INGRESOS_PK on INGRESOS (
IDINGRESO
);

/*==============================================================*/
/* Table: INSUMOS                                               */
/*==============================================================*/
create table INSUMOS (
   IDINSUMO             SERIAL               not null,
   IDTIPOINSUMO         INT4                 not null,
   NOMBREINSUMO         VARCHAR(100)         not null,
   CANTIDADINSUMO       NUMERIC(6)           not null,
   DESCRIPCIONINSUMO    VARCHAR(200)         not null,
   OBSERVACIONINSUMO    VARCHAR(200)         not null,
   constraint PK_INSUMOS primary key (IDINSUMO)
);

/*==============================================================*/
/* Index: INSUMOS_PK                                            */
/*==============================================================*/
create unique index INSUMOS_PK on INSUMOS (
IDINSUMO
);

/*==============================================================*/
/* Index: RELATIONSHIP_2_FK                                     */
/*==============================================================*/
create  index RELATIONSHIP_2_FK on INSUMOS (
IDTIPOINSUMO
);

/*==============================================================*/
/* Table: NECESIDADES                                           */
/*==============================================================*/
create table NECESIDADES (
   IDNECESIDAD          SERIAL               not null,
   NOMBREPERSONASOLICITA VARCHAR(100)         not null,
   ARTICULONECESITAPERSONA VARCHAR(100)         not null,
   FECHASOLICITUD       DATE                 not null,
   AREATRABAJOPERSONA   VARCHAR(50)          not null,
   OBSERVACIONSOLICITUD VARCHAR(200)         not null,
   constraint PK_NECESIDADES primary key (IDNECESIDAD)
);

/*==============================================================*/
/* Index: NECESIDADES_PK                                        */
/*==============================================================*/
create unique index NECESIDADES_PK on NECESIDADES (
IDNECESIDAD
);

/*==============================================================*/
/* Table: PRESENTACIONES                                        */
/*==============================================================*/
create table PRESENTACIONES (
   IDPRESENTACION       SERIAL               not null,
   NOMBREPRESENTACION   VARCHAR(50)          not null,
   constraint PK_PRESENTACIONES primary key (IDPRESENTACION)
);

/*==============================================================*/
/* Index: PRESENTACIONES_PK                                     */
/*==============================================================*/
create unique index PRESENTACIONES_PK on PRESENTACIONES (
IDPRESENTACION
);

/*==============================================================*/
/* Table: REACTIVOS                                             */
/*==============================================================*/
create table REACTIVOS (
   IDREACTIVO           SERIAL               not null,
   IDPRESENTACION       INT4                 not null,
   CODIGOREACTIVO       VARCHAR(10)          not null,
   LOTEREACTIVO         VARCHAR(15)          not null,
   NOMBREREACTIVO       VARCHAR(50)          not null,
   FABRICANTEREACTIVO   VARCHAR(50)          not null,
   DESCRIPCIONREACTIVO  VARCHAR(200)         not null,
   INCERTIDUMBREREACTIVO VARCHAR(50)          not null,
   NCATREACTIVO         VARCHAR(10)          not null,
   NCASREACTIVO         VARCHAR(10)          not null,
   FECHAINGRESOREACTIVO DATE                 not null,
   FECHAELABORACIONREACTIVO DATE                 not null,
   FECHACADUCIDADREACTIVO DATE                 not null,
   MARCAREACTIVO        VARCHAR(50)          not null,
   PROVEEDORREACTIVO    VARCHAR(50)          not null,
   CERTIFICADOREACTIVO  VARCHAR(50)          not null,
   RESPONSABLEREACTIVO  VARCHAR(50)          not null,
   CANTIDADREACTIVO     NUMERIC(6)           not null,
   OBSERVACIONREACTIVO  VARCHAR(200)         not null,
   constraint PK_REACTIVOS primary key (IDREACTIVO)
);

/*==============================================================*/
/* Index: REACTIVOS_PK                                          */
/*==============================================================*/
create unique index REACTIVOS_PK on REACTIVOS (
IDREACTIVO
);

/*==============================================================*/
/* Index: TIENE_FK                                              */
/*==============================================================*/
create  index TIENE_FK on REACTIVOS (
IDPRESENTACION
);

/*==============================================================*/
/* Table: TIPOSINSUMO                                           */
/*==============================================================*/
create table TIPOSINSUMO (
   IDTIPOINSUMO         SERIAL               not null,
   NOMBRETIPOINSUMO     VARCHAR(50)          not null,
   constraint PK_TIPOSINSUMO primary key (IDTIPOINSUMO)
);

/*==============================================================*/
/* Index: TIPOSINSUMO_PK                                        */
/*==============================================================*/
create unique index TIPOSINSUMO_PK on TIPOSINSUMO (
IDTIPOINSUMO
);

/*==============================================================*/
/* Table: USUARIOS                                              */
/*==============================================================*/
create table USUARIOS (
   IDUSUARIO            SERIAL               not null,
   NOMBREUSUARIO        VARCHAR(30)          not null,
   APELLIDOUSUARIO      VARCHAR(30)          not null,
   NICKUSUARIO          VARCHAR(60)          not null,
   CONTRASENAUSUARIO    VARCHAR(60)          not null,
   TIPOUSUARIO          VARCHAR(15)          not null,
   ESTADOUSUARIO        VARCHAR(8)           not null,
   ULTIMASESIONUSUARIO  DATE                 null,
   constraint PK_USUARIOS primary key (IDUSUARIO)
);

/*==============================================================*/
/* Index: USUARIOS_PK                                           */
/*==============================================================*/
create unique index USUARIOS_PK on USUARIOS (
IDUSUARIO
);

alter table INSUMOS
   add constraint FK_INSUMOS_RELATIONS_TIPOSINS foreign key (IDTIPOINSUMO)
      references TIPOSINSUMO (IDTIPOINSUMO)
      on delete restrict on update restrict;

alter table REACTIVOS
   add constraint FK_REACTIVO_TIENE_PRESENTA foreign key (IDPRESENTACION)
      references PRESENTACIONES (IDPRESENTACION)
      on delete restrict on update restrict;

