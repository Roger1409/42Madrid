document.addEventListener('DOMContentLoaded', () => {
    // Obras
    const btnCrearObra = document.getElementById('btn-crear-obra');
    const btnCancelarObra = document.getElementById('btn-cancelar-obra');
    const formularioObra = document.getElementById('formulario-obra');
    const listadoObras = document.getElementById('listado-obras');

    if (btnCrearObra && btnCancelarObra && formularioObra && listadoObras) {
        btnCrearObra.addEventListener('click', () => {
            formularioObra.style.display = 'block';
            listadoObras.style.display = 'none';
            document.getElementById('form-obra').reset();
            document.getElementById('id_obra_editar').value = '';
        });

        btnCancelarObra.addEventListener('click', () => {
            formularioObra.style.display = 'none';
            listadoObras.style.display = 'block';
        });
    }

    function cargarObras() {
        fetch('http://127.0.0.1:5001/obras')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const tablaObras = document.getElementById('tabla-obras');
                tablaObras.innerHTML = '';

                data.forEach(obra => {
                    const row = tablaObras.insertRow();
                    const idObraCell = row.insertCell();
                    const nombreCell = row.insertCell();
                    const idPromotorCell = row.insertCell();
                    const importeContratoCell = row.insertCell();
                    const avalBancarioCell = row.insertCell();
                    const fechaInicioCell = row.insertCell();
                    const accionesCell = row.insertCell();

                    idObraCell.textContent = obra.id_obra;
                    nombreCell.textContent = obra.nombre;
                    idPromotorCell.textContent = obra.id_promotor;
                    importeContratoCell.textContent = obra.importe_contrato ? parseFloat(obra.importe_contrato).toFixed(2) : '';
                    avalBancarioCell.textContent = obra.aval_bancario ? parseFloat(obra.aval_bancario).toFixed(2) : '';
                    fechaInicioCell.textContent = obra.fecha_inicio || '';

                    const btnEditar = document.createElement('button');
                    btnEditar.textContent = 'Editar';
                    btnEditar.classList.add('btn-editar');
                    btnEditar.addEventListener('click', () => {
                        cargarFormularioObra(obra.id_obra);
                    });
                    accionesCell.appendChild(btnEditar);

                    const btnEliminar = document.createElement('button');
                    btnEliminar.textContent = 'Eliminar';
                    btnEliminar.classList.add('btn-eliminar');
                    btnEliminar.addEventListener('click', () => {
                        if (confirm(`¿Estás seguro de que quieres eliminar la obra con ID: ${obra.id_obra}?`)) {
                            eliminarObra(obra.id_obra);
                        }
                    });
                    accionesCell.appendChild(btnEliminar);
                });
            })
            .catch(error => {
                console.error('Error al cargar las obras:', error);
            });
    }

    function cargarFormularioObra(idObra) {
        fetch(`http://127.0.0.1:5001/obras/${idObra}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(obra => {
                const idObraEditarInput = document.getElementById('id_obra_editar');
                const idObraInput = document.getElementById('id_obra');
                const nombreInput = document.getElementById('nombre');
                const idPromotorInput = document.getElementById('id_promotor');
                const importeContratoInput = document.getElementById('importe_contrato');
                const avalBancarioInput = document.getElementById('aval_bancario');
                const fechaInicioInput = document.getElementById('fecha_inicio');

                idObraEditarInput.value = obra.id_obra;
                idObraInput.value = obra.id_obra;
                nombreInput.value = obra.nombre;
                idPromotorInput.value = obra.id_promotor || '';
                importeContratoInput.value = obra.importe_contrato || '';
                avalBancarioInput.value = obra.aval_bancario || '';
                fechaInicioInput.value = obra.fecha_inicio || '';

                formularioObra.style.display = 'block';
                listadoObras.style.display = 'none';
            })
            .catch(error => {
                console.error('Error al cargar los datos de la obra para editar:', error);
            });
    }

    function eliminarObra(idObra) {
        fetch(`http://127.0.0.1:5001/obras/${idObra}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Obra eliminada:', data);
                cargarObras();
            })
            .catch(error => {
                console.error('Error al eliminar la obra:', error);
            });
    }

    const formObra = document.getElementById('form-obra');
    if (formObra) {
        formObra.addEventListener('submit', (event) => {
            event.preventDefault();

            const formData = new FormData(formObra);
            const obraData = {};
            formData.forEach((value, key) => {
                obraData[key] = value;
            });

            const idObraEditar = document.getElementById('id_obra_editar').value;
            const method = idObraEditar ? 'PUT' : 'POST';
            const url = idObraEditar ? `http://127.0.0.1:5001/obras/${idObraEditar}` : 'http://127.0.0.1:5001/obras';

            fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(obraData),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(`Obra ${method === 'PUT' ? 'actualizada' : 'creada'}:`, data);
                    formularioObra.style.display = 'none';
                    listadoObras.style.display = 'block';
                    cargarObras();
                    formObra.reset();
                    document.getElementById('id_obra_editar').value = '';
                })
                .catch(error => {
                    console.error(`Error al ${method === 'PUT' ? 'actualizar' : 'creada'} la obra:`, error);
                });
        });
    }

    // Promotores
    const btnCrearPromotor = document.getElementById('btn-crear-promotor');
    const btnCancelarPromotor = document.getElementById('btn-cancelar-promotor');
    const formularioPromotor = document.getElementById('formulario-promotor');
    const listadoPromotores = document.getElementById('listado-promotores');

    if (btnCrearPromotor && btnCancelarPromotor && formularioPromotor && listadoPromotores) {
        btnCrearPromotor.addEventListener('click', () => {
            formularioPromotor.style.display = 'block';
            listadoPromotores.style.display = 'none';
            document.getElementById('form-promotor').reset();
            document.getElementById('id_promotor_editar').value = '';
        });

        btnCancelarPromotor.addEventListener('click', () => {
            formularioPromotor.style.display = 'none';
            listadoPromotores.style.display = 'block';
        });
    }

    function cargarPromotores() {
        fetch('http://127.0.0.1:5001/promotores')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const tablaPromotores = document.getElementById('tabla-promotores');
                tablaPromotores.innerHTML = '';

                data.forEach(promotor => {
                    const row = tablaPromotores.insertRow();
                    const idPromotorCell = row.insertCell();
                    const nombreCell = row.insertCell();
                    const accionesCell = row.insertCell();

                    idPromotorCell.textContent = promotor.id_promotor;
                    nombreCell.textContent = promotor.nombre;

                    const btnEditar = document.createElement('button');
                    btnEditar.textContent = 'Editar';
                    btnEditar.classList.add('btn-editar');
                    btnEditar.addEventListener('click', () => {
                        cargarFormularioPromotor(promotor.id_promotor);
                    });
                    accionesCell.appendChild(btnEditar);

                    const btnEliminar = document.createElement('button');
                    btnEliminar.textContent = 'Eliminar';
                    btnEliminar.classList.add('btn-eliminar');
                    btnEliminar.addEventListener('click', () => {
                        if (confirm(`¿Estás seguro de que quieres eliminar al promotor con ID: ${promotor.id_promotor}?`)) {
                            eliminarPromotor(promotor.id_promotor);
                        }
                    });
                    accionesCell.appendChild(btnEliminar);
                });
            })
            .catch(error => {
                console.error('Error al cargar los promotores:', error);
            });
    }

    function cargarFormularioPromotor(idPromotor) {
        fetch(`http://127.0.0.1:5001/promotores/${idPromotor}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(promotor => {
                const idPromotorEditarInput = document.getElementById('id_promotor_editar');
                const idPromotorInput = document.getElementById('id_promotor');
                const nombreInput = document.getElementById('nombre');

                idPromotorEditarInput.value = promotor.id_promotor;
                idPromotorInput.value = promotor.id_promotor;
                nombreInput.value = promotor.nombre;

                formularioPromotor.style.display = 'block';
                listadoPromotores.style.display = 'none';
            })
            .catch(error => {
                console.error('Error al cargar los datos del promotor para editar:', error);
            });
    }

    function eliminarPromotor(idPromotor) {
        fetch(`http://127.0.0.1:5001/promotores/${idPromotor}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Promotor eliminado:', data);
                cargarPromotores();
            })
            .catch(error => {
                console.error('Error al eliminar el promotor:', error);
            });
    }

    const formPromotor = document.getElementById('form-promotor');
    if (formPromotor) {
        formPromotor.addEventListener('submit', (event) => {
            event.preventDefault();

            const formData = new FormData(formPromotor);
            const promotorData = {};
            formData.forEach((value, key) => {
                promotorData[key] = value;
            });

            const idPromotorEditar = document.getElementById('id_promotor_editar').value;
            const method = idPromotorEditar ? 'PUT' : 'POST';
            const url = idPromotorEditar ? `http://127.0.0.1:5001/promotores/${idPromotorEditar}` : 'http://127.0.0.1:5001/promotores';

            fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(promotorData),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(`Promotor ${method === 'PUT' ? 'actualizado' : 'creado'}:`, data);
                    formularioPromotor.style.display = 'none';
                    listadoPromotores.style.display = 'block';
                    cargarPromotores();
                    formPromotor.reset();
                    document.getElementById('id_promotor_editar').value = '';
                })
                .catch(error => {
                    console.error(`Error al ${method === 'PUT' ? 'actualizar' : 'crear'} el promotor:`, error);
                });
        });
    }

    // Facturas
    const btnCrearFactura = document.getElementById('btn-crear-factura');
    const btnCancelarFactura = document.getElementById('btn-cancelar-factura');
    const formularioFactura = document.getElementById('formulario-factura');
    const listadoFacturas = document.getElementById('listado-facturas');

    if (btnCrearFactura && btnCancelarFactura && formularioFactura && listadoFacturas) {
        btnCrearFactura.addEventListener('click', () => {
            formularioFactura.style.display = 'block';
            listadoFacturas.style.display = 'none';
        });

        btnCancelarFactura.addEventListener('click', () => {
            formularioFactura.style.display = 'none';
            listadoFacturas.style.display = 'block';
        });
    }

    // Certificaciones
    const btnCrearCertificacion = document.getElementById('btn-crear-certificacion');
    const btnCancelarCertificacion = document.getElementById('btn-cancelar-certificacion');
    const formularioCertificacion = document.getElementById('formulario-certificacion');
    const listadoCertificaciones = document.getElementById('listado-certificaciones');

    if (btnCrearCertificacion && btnCancelarCertificacion && formularioCertificacion && listadoCertificaciones) {
        btnCrearCertificacion.addEventListener('click', () => {
            formularioCertificacion.style.display = 'block';
            listadoCertificaciones.style.display = 'none';
        });

        btnCancelarCertificacion.addEventListener('click', () => {
            formularioCertificacion.style.display = 'none';
            listadoCertificaciones.style.display = 'block';
        });
    }

    // Cobros
    const btnCrearCobro = document.getElementById('btn-crear-cobro');
    const btnCancelarCobro = document.getElementById('btn-cancelar-cobro');
    const formularioCobro = document.getElementById('formulario-cobro');
    const listadoCobros = document.getElementById('listado-cobros');

    if (btnCrearCobro && btnCancelarCobro && formularioCobro && listadoCobros) {
        btnCrearCobro.addEventListener('click', () => {
            formularioCobro.style.display = 'block';
            listadoCobros.style.display = 'none';
        });

        btnCancelarCobro.addEventListener('click', () => {
            formularioCobro.style.display = 'none';
            listadoCobros.style.display = 'block';
        });
    }

    // Cargar datos iniciales
    cargarObras();
    cargarPromotores();
});