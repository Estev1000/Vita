// ============================================
// CONFIGURACIÓN Y ESTADO
// ============================================

class HeladeriaApp {
    constructor() {
        // Precios (valores por defecto)
        this.precios = {
            '1_gusto': 1.00,
            '2_gustos': 1.80,
            '3_gustos': 2.50,
            '1_4kg': 3.00,
            '1_2kg': 6.00,
            '1kg': 11.00
        };

        // Carrito
        this.carrito = [];

        // Sabores
        this.sabores = [];

        // Historial de ventas
        this.ventas = [];

        // Ventas totales
        this.ventasTotales = 0.0;

        // Stock de Insumos (Mostrador)
        this.stockInsumos = {
            cucuruchos: 0,
            potes_1_4: 0,
            potes_1_2: 0,
            potes_1kg: 0
        };

        // Productos Envasados (Kiosco)
        this.productosEnvasados = [];

        // Cargar datos del localStorage
        this.cargarDatos();

        // Inicializar interfaz
        this.inicializar();
    }

    // ============================================
    // ALMACENAMIENTO DE DATOS
    // ============================================

    cargarDatos() {
        try {
            console.log('Cargando datos del localStorage...');
            const datosGuardados = localStorage.getItem('heladeriaData');
            if (datosGuardados) {
                console.log('Datos encontrados en localStorage');
                const datos = JSON.parse(datosGuardados);
                this.precios = datos.precios || this.precios;
                this.sabores = datos.sabores || [];
                this.ventasTotales = datos.ventasTotales || 0.0;
                this.ventas = datos.ventas || [];
                this.stockInsumos = datos.stockInsumos || { cucuruchos: 0, potes_1_4: 0, potes_1_2: 0, potes_1kg: 0 };
                this.productosEnvasados = datos.productosEnvasados || [];
                console.log('Sabores cargados desde localStorage:', this.sabores);
            } else {
                console.log('No se encontraron datos en localStorage');
            }

            // Si no hay sabores, usar valores por defecto
            if (this.sabores.length === 0) {
                console.log('Usando sabores por defecto');
                this.sabores = [
                    "Vainilla", "Chocolate", "Fresa", "Menta",
                    "Dulce de leche", "Coco", "Banana Split", "Frutilla a la crema"
                ];
                console.log('Sabores por defecto establecidos:', this.sabores);
                // Guardar los sabores por defecto en localStorage
                this.guardarDatos();
            }
        } catch (error) {
            console.error('Error al cargar datos:', error);
        }
    }

    guardarDatos() {
        try {
            const datos = {
                precios: this.precios,
                sabores: this.sabores,
                ventasTotales: this.ventasTotales,
                ventas: this.ventas,
                stockInsumos: this.stockInsumos,
                productosEnvasados: this.productosEnvasados
            };
            localStorage.setItem('heladeriaData', JSON.stringify(datos));
        } catch (error) {
            console.error('Error al guardar datos:', error);
        }
    }

    // ============================================
    // INICIALIZACIÓN
    // ============================================

    inicializar() {
        this.setupElementos();
        this.configurarEventos();
        this.actualizarUI();
        this.setupGlobalBarcodeCapture();
        this.focusBarcodeInput();
    }

    setupElementos() {
        // Campos de precios
        this.elementos = {
            // Precios
            precio1Gusto: document.getElementById('precio1Gusto'),
            precio2Gustos: document.getElementById('precio2Gustos'),
            precio3Gustos: document.getElementById('precio3Gustos'),
            precio1_4: document.getElementById('precio1_4'),
            precio1_2: document.getElementById('precio1_2'),
            precio1kg: document.getElementById('precio1kg'),

            // Sabores
            inputSaborNuevo: document.getElementById('inputSaborNuevo'),
            listaSabores: document.getElementById('listaSabores'),

            // Tipo de helado
            tipoHeladoRadios: document.querySelectorAll('input[name="tipoHelado"]'),
            numSaboresRadios: document.querySelectorAll('input[name="numSabores"]'),
            tamanioPoteRadios: document.querySelectorAll('input[name="tamanioPote"]'),

            // Combos
            combo1: document.getElementById('combo1'),
            combo2: document.getElementById('combo2'),
            combo3: document.getElementById('combo3'),

            // Secciones
            seccionGustos: document.getElementById('seccionGustos'),
            seccionPotes: document.getElementById('seccionPotes'),

            // Tabla carrito
            tablaCarrito: document.getElementById('tablaCarrito'),
            cuerpoTabla: document.getElementById('cuerpoTabla'),
            carritoVacio: document.getElementById('carritoVacio'),

            // Botones
            btnGuardarCambios: document.getElementById('btnGuardarCambios'),
            btnAgregarSabor: document.getElementById('btnAgregarSabor'),
            btnAgregarCarrito: document.getElementById('btnAgregarCarrito'),
            btnFinalizarCompra: document.getElementById('btnFinalizarCompra'),
            btnVerVentas: document.getElementById('btnVerVentas'),
            btnVerVentasHeader: document.getElementById('btnVentasHeader'),
            btnVerVentasCompra: document.getElementById('btnVerVentasCompra'),
            btnImprimirTicket: document.getElementById('btnImprimirTicket'),
            btnImprimirTicketCompra: document.getElementById('btnImprimirTicketCompra'),
            btnGuardarPrecios: document.getElementById('btnGuardarPrecios'),

            // Tabs
            tabButtons: document.querySelectorAll('.tab-button'),
            tabContents: document.querySelectorAll('.tab-content'),

            // Modales
            modalConfirmacion: document.getElementById('modalConfirmacion'),
            modalInfo: document.getElementById('modalInfo'),
            modalError: document.getElementById('modalError'),
            modalResumen: document.getElementById('modalResumen'),

            btnConfirmarSi: document.getElementById('btnConfirmarSi'),
            btnConfirmarNo: document.getElementById('btnConfirmarNo'),
            btnCerrarInfo: document.getElementById('btnCerrarInfo'),
            btnCerrarError: document.getElementById('btnCerrarError'),
            btnCerrarResumen: document.getElementById('btnCerrarResumen'),
            // Excel
            btnImportarExcel: document.getElementById('btnImportarExcel'),
            btnExportarExcel: document.getElementById('btnExportarExcel'),
            inputExcel: document.getElementById('inputExcel'),

            // --- NUEVOS ELEMENTOS DE STOCK ---
            // Radios Tipo Venta
            tipoVentaRadios: document.querySelectorAll('input[name="tipoVenta"]'),
            contenedorMostrador: document.getElementById('contenedorMostrador'),
            contenedorEnvasados: document.getElementById('contenedorEnvasados'),

            // Stock Insumos
            stockCucuruchos: document.getElementById('stockCucuruchos'),
            stockPotes1_4: document.getElementById('stockPotes1_4'),
            stockPotes1_2: document.getElementById('stockPotes1_2'),
            stockPotes1kg: document.getElementById('stockPotes1kg'),
            btnActualizarInsumos: document.getElementById('btnActualizarInsumos'),

            // Productos Envasados (Gestión)
            nuevoProdNombre: document.getElementById('nuevoProdNombre'),
            nuevoProdPrecio: document.getElementById('nuevoProdPrecio'),
            nuevoProdStock: document.getElementById('nuevoProdStock'),
            btnAgregarProducto: document.getElementById('btnAgregarProducto'),
            tablaProductosStock: document.getElementById('bodyProductosStock'),

            // Productos Envasados (Venta)
            gridProductosEnvasados: document.getElementById('gridProductosEnvasados'),
            btnAgregarPoteCarrito: document.getElementById('btnAgregarPoteCarrito'), // Botón Potes Mostrador

            // Lector de Código de Barras
            barcodeInput: document.getElementById('barcode-input-vita'),

            // Código de barras del nuevo producto
            nuevoProdBarcode: document.getElementById('nuevoProdBarcode'),

            // Buscador de productos envasados
            buscadorProductos: document.getElementById('buscadorProductos'),

            // Modales editar
            modalEditarArticulo: document.getElementById('modalEditarArticulo'),
            editArticuloId: document.getElementById('editArticuloId'),
            editArticuloNombre: document.getElementById('editArticuloNombre'),
            editArticuloPrecio: document.getElementById('editArticuloPrecio'),
            editArticuloStock: document.getElementById('editArticuloStock'),
            editArticuloBarcode: document.getElementById('editArticuloBarcode'),
            btnGuardarEditArticulo: document.getElementById('btnGuardarEditArticulo'),
            btnCancelarEditArticulo: document.getElementById('btnCancelarEditArticulo'),

            modalEditarVenta: document.getElementById('modalEditarVenta'),
            editVentaIdx: document.getElementById('editVentaIdx'),
            editVentaDesc: document.getElementById('editVentaDesc'),
            editVentaTotal: document.getElementById('editVentaTotal'),
            editVentaFecha: document.getElementById('editVentaFecha'),
            btnGuardarEditVenta: document.getElementById('btnGuardarEditVenta'),
            btnCancelarEditVenta: document.getElementById('btnCancelarEditVenta'),

            // Ventas tab
            resumenVentasDiarias: document.getElementById('resumenVentasDiarias'),
            filtroFechaVentas: document.getElementById('filtroFechaVentas'),
            btnFiltrarVentas: document.getElementById('btnFiltrarVentas'),
            btnMostrarTodasVentas: document.getElementById('btnMostrarTodasVentas'),
            bodyHistorialVentas: document.getElementById('bodyHistorialVentas'),

            ventaManualDesc: document.getElementById('ventaManualDesc'),
            ventaManualPrecio: document.getElementById('ventaManualPrecio'),
            ventaManualFecha: document.getElementById('ventaManualFecha'),
            btnAgregarVentaManual: document.getElementById('btnAgregarVentaManual'),
            btnLimpiarHistorial: document.getElementById('btnLimpiarHistorial'),
        };
    }

    configurarEventos() {
        // Botones de precios
        this.elementos.btnGuardarCambios.addEventListener('click', () => this.guardarPrecios());
        this.elementos.btnGuardarPrecios.addEventListener('click', () => this.guardarPrecios());

        // Botones de sabores
        this.elementos.btnAgregarSabor.addEventListener('click', () => this.agregarSabor());
        this.elementos.inputSaborNuevo.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.agregarSabor();
        });

        // Botones de carrito
        this.elementos.btnAgregarCarrito.addEventListener('click', () => this.agregarAlCarrito());
        this.elementos.btnFinalizarCompra.addEventListener('click', () => this.finalizarCompra());

        // Botones de ventas
        this.elementos.btnVerVentas.addEventListener('click', () => this.verVentasTotales());
        this.elementos.btnVerVentasHeader.addEventListener('click', () => this.verVentasTotales());
        this.elementos.btnVerVentasCompra.addEventListener('click', () => this.verVentasTotales());

        // Botones de impresión
        this.elementos.btnImprimirTicket.addEventListener('click', () => this.imprimirTicket());
        this.elementos.btnImprimirTicketCompra.addEventListener('click', () => this.imprimirTicket());

        // Tabs
        this.elementos.tabButtons.forEach((btn, index) => {
            btn.addEventListener('click', () => this.abrirTab(btn, index));
        });

        // Excel
        if (this.elementos.btnImportarExcel) this.elementos.btnImportarExcel.addEventListener('click', () => this.elementos.inputExcel && this.elementos.inputExcel.click());
        if (this.elementos.inputExcel) this.elementos.inputExcel.addEventListener('change', (e) => this.procesarExcel(e));
        if (this.elementos.btnExportarExcel) this.elementos.btnExportarExcel.addEventListener('click', () => this.exportarExcel());

        // Radio buttons de tipo de helado
        this.elementos.tipoHeladoRadios.forEach(radio => {
            radio.addEventListener('change', () => this.actualizarTipoProducto());
        });

        // Radio buttons de número de sabores
        this.elementos.numSaboresRadios.forEach(radio => {
            radio.addEventListener('change', () => this.actualizarEstadoSabores());
        });

        // Cerrar modales
        this.elementos.btnConfirmarNo.addEventListener('click', () => this.cerrarModal('confirmacion'));
        this.elementos.btnCerrarInfo.addEventListener('click', () => this.cerrarModal('info'));
        this.elementos.btnCerrarError.addEventListener('click', () => this.cerrarModal('error'));
        this.elementos.btnCerrarResumen.addEventListener('click', () => this.cerrarModal('resumen'));

        // --- NUEVOS EVENTOS ---
        // 1. Cambio Tipo Venta
        this.elementos.tipoVentaRadios.forEach(radio => {
            radio.addEventListener('change', () => this.actualizarModoVenta());
        });

        // 2. Insumos
        if (this.elementos.btnActualizarInsumos) {
            this.elementos.btnActualizarInsumos.addEventListener('click', () => this.guardarStockInsumos());
        }

        // 3. Productos Envasados Management
        if (this.elementos.btnAgregarProducto) {
            this.elementos.btnAgregarProducto.addEventListener('click', () => this.agregarProductoInventario());
        }

        // 4. Botón Agregar Pote (Mostrador)
        if (this.elementos.btnAgregarPoteCarrito) {
            this.elementos.btnAgregarPoteCarrito.addEventListener('click', () => this.agregarAlCarrito());
        }

        // 5. Lector de código de barras
        if (this.elementos.barcodeInput) {
            this.elementos.barcodeInput.addEventListener('keydown', (e) => this.handleBarcodeInput(e));
        }

        // 6. Buscador de productos envasados
        if (this.elementos.buscadorProductos) {
            this.elementos.buscadorProductos.addEventListener('input', () => this.filtrarProductosBuscador());
        }

        // 7. Modales editar artículo
        if (this.elementos.btnGuardarEditArticulo) {
            this.elementos.btnGuardarEditArticulo.addEventListener('click', () => this.guardarEdicionArticulo());
        }
        if (this.elementos.btnCancelarEditArticulo) {
            this.elementos.btnCancelarEditArticulo.addEventListener('click', () => this.cerrarModal('editarArticulo'));
        }

        // 8. Modales editar venta
        if (this.elementos.btnGuardarEditVenta) {
            this.elementos.btnGuardarEditVenta.addEventListener('click', () => this.guardarEdicionVenta());
        }
        if (this.elementos.btnCancelarEditVenta) {
            this.elementos.btnCancelarEditVenta.addEventListener('click', () => this.cerrarModal('editarVenta'));
        }

        // 9. Ventas: filtro, historial, venta manual
        if (this.elementos.btnFiltrarVentas) {
            this.elementos.btnFiltrarVentas.addEventListener('click', () => this.renderVentasDiarias());
        }
        if (this.elementos.btnMostrarTodasVentas) {
            this.elementos.btnMostrarTodasVentas.addEventListener('click', () => {
                if (this.elementos.filtroFechaVentas) this.elementos.filtroFechaVentas.value = '';
                this.renderVentasDiarias();
            });
        }
        if (this.elementos.btnAgregarVentaManual) {
            this.elementos.btnAgregarVentaManual.addEventListener('click', () => this.agregarVentaManual());
        }
        if (this.elementos.btnLimpiarHistorial) {
            this.elementos.btnLimpiarHistorial.addEventListener('click', () => this.limpiarHistorial());
        }

        // Atajos de teclado
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                this.guardarPrecios();
            }
            if (e.ctrlKey && e.key === 'v') {
                e.preventDefault();
                this.verVentasTotales();
            }
            if (e.key === 'Delete') {
                this.eliminarItemSeleccionado();
            }
        });
    }

    actualizarUI() {
        console.log('Actualizando interfaz de usuario...');
        try {
            console.log('Actualizando campos de precios...');
            this.actualizarCamposPrecios();

            console.log('Actualizando lista de sabores...');
            this.actualizarListaSabores();

            console.log('Actualizando combos de sabores...');
            this.actualizarCombosSabores();

            console.log('Actualizando tipo de producto...');
            this.actualizarTipoProducto();

            console.log('Actualizando tabla del carrito...');
            this.actualizarTablaCarrito();

            console.log('Actualizando sección inventario...');
            this.actualizarUIInventario();

            console.log('Interfaz de usuario actualizada correctamente');
        } catch (error) {
            console.error('Error al actualizar la interfaz de usuario:', error);
        }
    }

    // ============================================
    // TABS
    // ============================================

    abrirTab(boton, index) {
        // Remover clase active de todos los botones y contenidos
        this.elementos.tabButtons.forEach(btn => btn.classList.remove('active'));
        this.elementos.tabContents.forEach(content => content.classList.remove('active'));

        // Agregar clase active al botón y contenido clickeado
        boton.classList.add('active');
        this.elementos.tabContents[index].classList.add('active');

        // Si abre la pestaña de Ventas, renderizar
        const tabId = boton.getAttribute('data-tab');
        if (tabId === 'tab-ventas') {
            this.renderVentasDiarias();
            this.renderHistorialVentas();
        }
    }

    // ============================================
    // PRECIOS
    // ============================================

    validarPrecio(valor) {
        let precioStr = valor.trim();
        if (!precioStr) {
            throw new Error('El precio no puede estar vacío');
        }

        // Standardize decimal separator to '.'
        precioStr = precioStr.replace(',', '.');

        const parts = precioStr.split('.');
        if (parts.length > 2) {
            // More than one dot, assume thousands separators
            // e.g., "1.500.50" -> "1500.50"
            const decimalPart = parts.pop();
            const integerPart = parts.join('');
            precioStr = integerPart + '.' + decimalPart;
        } else if (parts.length === 2) {
            // One dot. Could be "1.50" (decimal) or "1.000" (thousands)
            const decimalPart = parts[1];
            if (decimalPart.length === 3) {
                // Likely a thousands separator, e.g., "1.000" -> "1000"
                precioStr = parts.join('');
            }
        }

        const precio = parseFloat(precioStr);

        if (isNaN(precio)) {
            throw new Error('Formato de número no válido. Use punto o coma para decimales (ej: 1.50 o 1,50). Los miles se manejan automáticamente.');
        }

        if (precio <= 0) {
            throw new Error('El precio debe ser mayor a cero');
        }

        return precio;
    }

    actualizarCamposPrecios() {
        this.elementos.precio1Gusto.value = this.precios['1_gusto'].toFixed(2);
        this.elementos.precio2Gustos.value = this.precios['2_gustos'].toFixed(2);
        this.elementos.precio3Gustos.value = this.precios['3_gustos'].toFixed(2);
        this.elementos.precio1_4.value = this.precios['1_4kg'].toFixed(2);
        this.elementos.precio1_2.value = this.precios['1_2kg'].toFixed(2);
        this.elementos.precio1kg.value = this.precios['1kg'].toFixed(2);
    }

    guardarPrecios() {
        this.mostrarConfirmacion(
            '¿Estás seguro de que deseas actualizar los precios?',
            () => {
                try {
                    console.log('Iniciando validación de precios...');

                    // Validar y actualizar precios
                    const precio1 = this.validarPrecio(this.elementos.precio1Gusto.value);
                    const precio2 = this.validarPrecio(this.elementos.precio2Gustos.value);
                    const precio3 = this.validarPrecio(this.elementos.precio3Gustos.value);
                    const precio1_4 = this.validarPrecio(this.elementos.precio1_4.value);
                    const precio1_2 = this.validarPrecio(this.elementos.precio1_2.value);
                    const precio1kg = this.validarPrecio(this.elementos.precio1kg.value);

                    console.log('Precios validados:', {
                        '1_gusto': precio1,
                        '2_gustos': precio2,
                        '3_gustos': precio3,
                        '1_4kg': precio1_4,
                        '1_2kg': precio1_2,
                        '1kg': precio1kg
                    });

                    // Actualizar objeto de precios
                    this.precios['1_gusto'] = precio1;
                    this.precios['2_gustos'] = precio2;
                    this.precios['3_gustos'] = precio3;
                    this.precios['1_4kg'] = precio1_4;
                    this.precios['1_2kg'] = precio1_2;
                    this.precios['1kg'] = precio1kg;

                    // Guardar datos en localStorage
                    this.guardarDatos();
                    console.log('Datos guardados en localStorage');

                    // Actualizar campos visuales
                    this.actualizarCamposPrecios();
                    console.log('Campos de precios actualizados en UI');

                    this.mostrarInfo('✅ Precios actualizados correctamente');
                } catch (error) {
                    console.error('Error al guardar precios:', error);
                    this.mostrarError('❌ ' + (error.message || 'Error al guardar los precios'));
                }
            }
        );
    }

    // ============================================
    // GESTIÓN DE INVENTARIO
    // ============================================

    actualizarUIInventario() {
        // Actualizar inputs de stock insumos
        if (this.elementos.stockCucuruchos) {
            this.elementos.stockCucuruchos.value = this.stockInsumos.cucuruchos;
            this.elementos.stockPotes1_4.value = this.stockInsumos.potes_1_4;
            this.elementos.stockPotes1_2.value = this.stockInsumos.potes_1_2;
            this.elementos.stockPotes1kg.value = this.stockInsumos.potes_1kg;
        }

        // Actualizar tabla gestión productos
        this.renderTablaProductos();

        // Actualizar grid venta productos
        this.renderGridProductosVenta();
    }

    guardarStockInsumos() {
        try {
            this.stockInsumos.cucuruchos = parseInt(this.elementos.stockCucuruchos.value) || 0;
            this.stockInsumos.potes_1_4 = parseInt(this.elementos.stockPotes1_4.value) || 0;
            this.stockInsumos.potes_1_2 = parseInt(this.elementos.stockPotes1_2.value) || 0;
            this.stockInsumos.potes_1kg = parseInt(this.elementos.stockPotes1kg.value) || 0;

            this.guardarDatos();
            this.mostrarInfo('✅ Stock de insumos actualizado correctamente');
        } catch (error) {
            this.mostrarError('Error al guardar stock: ' + error.message);
        }
    }

    agregarProductoInventario() {
        const nombre = this.elementos.nuevoProdNombre.value.trim();
        const precio = parseFloat(this.elementos.nuevoProdPrecio.value);
        const stock = parseInt(this.elementos.nuevoProdStock.value);
        const barcode = this.elementos.nuevoProdBarcode ? this.elementos.nuevoProdBarcode.value.trim() : '';

        if (!nombre || isNaN(precio) || isNaN(stock)) {
            this.mostrarError('Por favor complete todos los campos correctamente');
            return;
        }

        const nuevoProducto = {
            id: Date.now().toString(),
            nombre,
            precio,
            stock,
            barcode
        };

        this.productosEnvasados.push(nuevoProducto);

        // Limpiar inputs
        this.elementos.nuevoProdNombre.value = '';
        this.elementos.nuevoProdPrecio.value = '';
        this.elementos.nuevoProdStock.value = '';
        if (this.elementos.nuevoProdBarcode) this.elementos.nuevoProdBarcode.value = '';

        this.guardarDatos();
        this.actualizarUIInventario();
        this.mostrarInfo('Producto agregado al inventario');
    }

    eliminarProductoInventario(id) {
        this.mostrarConfirmacion('¿Eliminar este producto del inventario?', () => {
            this.productosEnvasados = this.productosEnvasados.filter(p => p.id !== id);
            this.guardarDatos();
            this.actualizarUIInventario();
        });
    }

    renderTablaProductos() {
        if (!this.elementos.tablaProductosStock) return;

        this.elementos.tablaProductosStock.innerHTML = '';

        if (this.productosEnvasados.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = '<td colspan="5" style="text-align:center;color:#888;padding:14px">No hay productos envasados cargados</td>';
            this.elementos.tablaProductosStock.appendChild(tr);
            return;
        }

        this.productosEnvasados.forEach(prod => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${prod.nombre}</td>
                <td>$${prod.precio.toFixed(2)}</td>
                <td>${prod.stock}</td>
                <td style="font-size:0.85em;color:#aaa">${prod.barcode || '-'}</td>
                <td style="display:flex;gap:6px;">
                    <button class="btn btn-info btn-small btn-edit-art" title="Editar">✏️</button>
                    <button class="btn btn-danger btn-small btn-del-art" title="Eliminar">✕</button>
                </td>
            `;
            tr.querySelector('.btn-edit-art').addEventListener('click', () => this.abrirEditarArticulo(prod.id));
            tr.querySelector('.btn-del-art').addEventListener('click', () => this.eliminarProductoInventario(prod.id));
            this.elementos.tablaProductosStock.appendChild(tr);
        });
    }

    abrirEditarArticulo(id) {
        const prod = this.productosEnvasados.find(p => p.id === id);
        if (!prod) return;
        this.elementos.editArticuloId.value = prod.id;
        this.elementos.editArticuloNombre.value = prod.nombre;
        this.elementos.editArticuloPrecio.value = prod.precio;
        this.elementos.editArticuloStock.value = prod.stock;
        this.elementos.editArticuloBarcode.value = prod.barcode || '';
        this.elementos.modalEditarArticulo.classList.add('active');
    }

    guardarEdicionArticulo() {
        const id = this.elementos.editArticuloId.value;
        const prod = this.productosEnvasados.find(p => p.id === id);
        if (!prod) return;

        const nombre = this.elementos.editArticuloNombre.value.trim();
        const precio = parseFloat(this.elementos.editArticuloPrecio.value);
        const stock = parseInt(this.elementos.editArticuloStock.value);
        const barcode = this.elementos.editArticuloBarcode.value.trim();

        if (!nombre || isNaN(precio) || isNaN(stock)) {
            this.mostrarError('Por favor complete todos los campos correctamente');
            return;
        }

        prod.nombre = nombre;
        prod.precio = precio;
        prod.stock = stock;
        prod.barcode = barcode;

        this.guardarDatos();
        this.actualizarUIInventario();
        this.cerrarModal('editarArticulo');
        this.mostrarInfo('✅ Artículo actualizado correctamente');
    }

    renderGridProductosVenta(filtro = '') {
        if (!this.elementos.gridProductosEnvasados) return;

        this.elementos.gridProductosEnvasados.innerHTML = '';

        const productosFiltrados = filtro
            ? this.productosEnvasados.filter(p => p.nombre.toLowerCase().includes(filtro.toLowerCase()))
            : this.productosEnvasados;

        if (productosFiltrados.length === 0) {
            this.elementos.gridProductosEnvasados.innerHTML = `<p class="empty-state">${filtro ? 'No se encontraron productos con ese nombre.' : 'No hay productos disponibles.'}</p>`;
            return;
        }

        productosFiltrados.forEach(prod => {
            const div = document.createElement('div');
            div.className = `product-card ${prod.stock <= 0 ? 'no-stock' : ''}`;
            div.innerHTML = `
                <h4>${prod.nombre}</h4>
                <div class="price">$${prod.precio.toFixed(2)}</div>
                <div class="stock">Stock: ${prod.stock}</div>
            `;

            if (prod.stock > 0) {
                div.addEventListener('click', () => this.agregarEnvasadoAlCarrito(prod));
            }

            this.elementos.gridProductosEnvasados.appendChild(div);
        });
    }

    filtrarProductosBuscador() {
        const filtro = this.elementos.buscadorProductos ? this.elementos.buscadorProductos.value.trim() : '';
        this.renderGridProductosVenta(filtro);
    }

    actualizarModoVenta() {
        const modo = document.querySelector('input[name="tipoVenta"]:checked').value;
        if (modo === 'mostrador') {
            this.elementos.contenedorMostrador.style.display = 'block';
            this.elementos.contenedorEnvasados.style.display = 'none';
        } else {
            this.elementos.contenedorMostrador.style.display = 'none';
            this.elementos.contenedorEnvasados.style.display = 'block';
            this.renderGridProductosVenta(); // Refrescar grid
            this.focusBarcodeInput(); // Re-enfocar el campo de código de barras al cambiar a envasados
        }
    }

    // ============================================
    // LECTOR DE CÓDIGO DE BARRAS
    // ============================================

    focusBarcodeInput() {
        if (this.elementos.barcodeInput) {
            this.elementos.barcodeInput.focus();
        }
    }

    handleBarcodeInput(event) {
        if (event.key !== 'Enter') return;
        event.preventDefault();

        const barcode = event.target.value.trim();
        if (!barcode) return;

        // Buscar producto envasado por código de barras
        const producto = this.productosEnvasados.find(p => p.barcode && p.barcode === barcode);

        if (producto) {
            this.agregarEnvasadoAlCarrito(producto);
            event.target.value = '';
            // Feedback visual: borde verde
            event.target.style.borderColor = '#10b981';
            event.target.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.3)';
            setTimeout(() => {
                event.target.style.borderColor = '';
                event.target.style.boxShadow = '';
            }, 600);
        } else {
            // Producto no encontrado
            this.mostrarError(`❌ Producto no encontrado con código: ${barcode}`);
            event.target.value = '';
            // Feedback visual: borde rojo
            event.target.style.borderColor = '#ef4444';
            event.target.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.3)';
            setTimeout(() => {
                event.target.style.borderColor = '';
                event.target.style.boxShadow = '';
            }, 600);
        }
    }

    setupGlobalBarcodeCapture() {
        let buffer = '';
        let lastKeyTime = 0;
        const maxInterKeyDelayMs = 120;

        document.addEventListener('keydown', (e) => {
            // Solo actuar si estamos en modo envasados
            const modoEnvasadosActivo =
                this.elementos.contenedorEnvasados &&
                this.elementos.contenedorEnvasados.style.display !== 'none';
            if (!modoEnvasadosActivo) return;

            const activeEl = document.activeElement;
            const activeTag = activeEl && activeEl.tagName ? activeEl.tagName.toLowerCase() : '';
            const activeId = activeEl && activeEl.id ? activeEl.id : '';
            // Si el foco está en otro campo (no el barcode), ignorar
            const isTypingInOtherField =
                (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') &&
                activeId !== 'barcode-input-vita';
            if (isTypingInOtherField) return;

            if (e.key === 'Enter') {
                const barcode = buffer.trim();
                buffer = '';
                lastKeyTime = 0;
                if (!barcode) return;

                // Simular input en el campo para aprovechar handleBarcodeInput
                if (this.elementos.barcodeInput) {
                    this.elementos.barcodeInput.value = barcode;
                    this.handleBarcodeInput({
                        key: 'Enter',
                        preventDefault: () => { },
                        target: this.elementos.barcodeInput
                    });
                }
                return;
            }

            if (e.key.length !== 1) return;
            const now = Date.now();

            if (lastKeyTime && (now - lastKeyTime) > maxInterKeyDelayMs) {
                buffer = '';
            }

            lastKeyTime = now;
            buffer += e.key;
        });
    }

    agregarEnvasadoAlCarrito(producto) {
        // Verificar si ya hay en el carrito para no superar stock
        const enCarrito = this.carrito.filter(item => item.idProducto === producto.id).length;

        if (enCarrito + 1 > producto.stock) {
            this.mostrarError('No hay suficiente stock de este producto');
            return;
        }

        this.carrito.push({
            descripcion: producto.nombre,
            precio: producto.precio,
            tipo: 'envasado',
            idProducto: producto.id
        });

        this.actualizarTablaCarrito();
        this.mostrarInfo(`Agregado: ${producto.nombre}`);
    }

    // ============================================
    // SABORES
    // ============================================

    actualizarListaSabores() {
        console.log('Actualizando lista de sabores...');
        console.log('Elemento listaSabores:', this.elementos.listaSabores);
        console.log('Sabores a mostrar:', this.sabores);

        // Limpiar la lista
        if (this.elementos.listaSabores) {
            this.elementos.listaSabores.innerHTML = '';

            // Verificar si hay sabores para mostrar
            if (this.sabores && this.sabores.length > 0) {
                this.sabores.forEach((sabor, index) => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <span>${sabor}</span>
                        <button type="button" data-index="${index}" class="btn-eliminar">✕</button>
                    `;
                    li.querySelector('button').addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.eliminarSabor(index);
                    });
                    this.elementos.listaSabores.appendChild(li);
                });
                console.log('Lista de sabores actualizada');
            } else {
                console.log('No hay sabores para mostrar');
                const li = document.createElement('li');
                li.textContent = 'No hay sabores disponibles';
                li.style.color = '#666';
                li.style.fontStyle = 'italic';
                this.elementos.listaSabores.appendChild(li);
            }
        } else {
            console.error('No se encontró el elemento listaSabores en el DOM');
        }
    }

    actualizarCombosSabores() {
        [this.elementos.combo1, this.elementos.combo2, this.elementos.combo3].forEach(combo => {
            const valorActual = combo.value;
            combo.innerHTML = '';
            this.sabores.forEach(sabor => {
                const option = document.createElement('option');
                option.value = sabor;
                option.textContent = sabor;
                combo.appendChild(option);
            });
            if (valorActual && this.sabores.includes(valorActual)) {
                combo.value = valorActual;
            }
        });
    }

    agregarSabor() {
        const sabor = this.elementos.inputSaborNuevo.value.trim();

        if (!sabor) {
            this.mostrarError('No se puede agregar un sabor vacío');
            return;
        }

        if (this.sabores.some(s => s.toLowerCase() === sabor.toLowerCase())) {
            this.mostrarInfo(`El sabor '${sabor}' ya existe`);
            return;
        }

        this.sabores.push(sabor);
        this.elementos.inputSaborNuevo.value = '';
        this.guardarDatos();
        this.actualizarListaSabores();
        this.actualizarCombosSabores();
        this.mostrarInfo(`Sabor '${sabor}' agregado correctamente`);
    }

    eliminarSabor(index) {
        const sabor = this.sabores[index];
        this.mostrarConfirmacion(
            `¿Estás seguro de que deseas eliminar el sabor '${sabor}'?`,
            () => {
                this.sabores.splice(index, 1);
                this.guardarDatos();
                this.actualizarListaSabores();
                this.actualizarCombosSabores();
            }
        );
    }

    // ============================================
    // IMPORT / EXPORT EXCEL
    // ============================================

    procesarExcel(event) {
        const file = event.target.files ? event.target.files[0] : null;
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });

                let importSabores = 0;
                let importPrecios = 0;
                let importVentas = 0;
                let importProductos = 0;

                // ---- Hoja Sabores ----
                const hojaSabores = workbook.Sheets['Sabores'] || workbook.Sheets[workbook.SheetNames.find(n => /sabor/i.test(n))];
                if (hojaSabores) {
                    const jsonSab = XLSX.utils.sheet_to_json(hojaSabores);
                    jsonSab.forEach(row => {
                        const keys = Object.keys(row);
                        const keySabor = keys.find(k => /sabor|nombre|producto/i.test(k));
                        if (keySabor) {
                            const sabor = String(row[keySabor]).trim();
                            if (sabor && !this.sabores.some(s => s.toLowerCase() === sabor.toLowerCase())) {
                                this.sabores.push(sabor);
                                importSabores++;
                            }
                        }
                    });
                }

                // ---- Hoja Precios ----
                const hojaPrecios = workbook.Sheets['Precios'] || workbook.Sheets[workbook.SheetNames.find(n => /precio/i.test(n))];
                if (hojaPrecios) {
                    const jsonPre = XLSX.utils.sheet_to_json(hojaPrecios);
                    jsonPre.forEach(row => {
                        const keys = Object.keys(row);
                        const keyKey = keys.find(k => /key|nombre|campo/i.test(k));
                        const keyValue = keys.find(k => /value|precio|valor|amount/i.test(k));
                        if (keyKey && keyValue) {
                            const k = String(row[keyKey]).trim();
                            const v = parseFloat(String(row[keyValue]).replace(',', '.'));
                            if (k && !isNaN(v) && this.precios.hasOwnProperty(k)) {
                                this.precios[k] = v;
                                importPrecios++;
                            }
                        }
                    });
                }

                // ---- Hoja Ventas (nueva estructura: una fila por venta) ----
                const hojaVentas = workbook.Sheets['Ventas'] || workbook.Sheets[workbook.SheetNames.find(n => /venta/i.test(n))];
                if (hojaVentas) {
                    const jsonVentas = XLSX.utils.sheet_to_json(hojaVentas);
                    let ventasImportadas = [];
                    let totalImportado = 0;

                    jsonVentas.forEach(row => {
                        // Formato nuevo: Fecha, Total, Items (JSON string)
                        const fecha = row['Fecha'] || row['fecha'] || row['Fecha de Venta'];
                        const total = parseFloat(row['Total'] || row['total'] || row['Total de la Venta'] || 0);
                        const itemsRaw = row['Items'] || row['items'] || '';

                        if (!fecha || isNaN(total)) return;

                        // Intentar parsear Items JSON
                        let items = [];
                        if (itemsRaw) {
                            try { items = JSON.parse(itemsRaw); } catch (e) {
                                // Si no es JSON, usar descripción directa
                                const desc = row['Descripci\u00f3n'] || row['Descripcion'] || String(itemsRaw);
                                items = [{ descripcion: desc, precio: total }];
                            }
                        } else {
                            // Formato antiguo: solo fecha y total
                            const descOld = row['Descripci\u00f3n del Producto'] || row['Descripcion'] || 'Venta importada';
                            items = [{ descripcion: descOld, precio: total }];
                        }

                        ventasImportadas.push({
                            fecha: new Date(fecha).toISOString(),
                            total: total,
                            items: items
                        });
                        totalImportado += total;
                        importVentas++;
                    });

                    if (ventasImportadas.length > 0) {
                        // Reemplazar historial con el importado
                        this.ventas = ventasImportadas;
                        this.ventasTotales = totalImportado;
                    }
                }

                // ---- Hoja Productos Envasados ----
                const hojaProductos = workbook.Sheets['Productos'] || workbook.Sheets[workbook.SheetNames.find(n => /producto|envasado|kiosco/i.test(n))];
                if (hojaProductos) {
                    const jsonProd = XLSX.utils.sheet_to_json(hojaProductos);
                    let productosImportados = [];
                    jsonProd.forEach(row => {
                        const nombre = row['Nombre'] || row['nombre'] || row['Producto'];
                        const precio = parseFloat(row['Precio'] || row['precio'] || 0);
                        const stock = parseInt(row['Stock'] || row['stock'] || 0);
                        const barcode = row['Codigo'] || row['codigo'] || row['C\u00f3digo'] || row['Barcode'] || '';
                        const id = row['ID'] || row['id'] || Date.now().toString() + Math.random();
                        if (nombre && !isNaN(precio)) {
                            productosImportados.push({ id: String(id), nombre: String(nombre).trim(), precio, stock: isNaN(stock) ? 0 : stock, barcode: String(barcode).trim() });
                            importProductos++;
                        }
                    });
                    if (productosImportados.length > 0) {
                        this.productosEnvasados = productosImportados;
                    }
                }

                // ---- Hoja Stock Insumos ----
                const hojaStock = workbook.Sheets['StockInsumos'] || workbook.Sheets[workbook.SheetNames.find(n => /stock|insumo/i.test(n))];
                if (hojaStock) {
                    const jsonStock = XLSX.utils.sheet_to_json(hojaStock);
                    jsonStock.forEach(row => {
                        const clave = row['Clave'] || row['clave'] || row['Key'];
                        const valor = parseInt(row['Valor'] || row['valor'] || row['Value'] || 0);
                        if (clave && this.stockInsumos.hasOwnProperty(clave) && !isNaN(valor)) {
                            this.stockInsumos[clave] = valor;
                        }
                    });
                }

                this.guardarDatos();
                this.actualizarUI();
                // Refrescar pestaña Ventas en tiempo real (si está visible)
                this.renderVentasDiarias();
                this.renderHistorialVentas();
                if (this.elementos.inputExcel) this.elementos.inputExcel.value = '';

                let mensaje = '\u2705 Importaci\u00f3n completada.';
                if (importSabores) mensaje += `<br>Sabores importados: <b>${importSabores}</b>`;
                if (importPrecios) mensaje += `<br>Precios actualizados: <b>${importPrecios}</b>`;
                if (importVentas) mensaje += `<br>Ventas restauradas: <b>${importVentas}</b>`;
                if (importProductos) mensaje += `<br>Productos envasados: <b>${importProductos}</b>`;
                if (!importSabores && !importPrecios && !importVentas && !importProductos) {
                    mensaje = 'No se detectaron datos v\u00e1lidos en el archivo.';
                }

                this.mostrarInfo(mensaje);
            } catch (err) {
                console.error(err);
                this.mostrarError('Error al procesar el archivo Excel: ' + (err.message || ''));
            }
        };
        reader.readAsArrayBuffer(file);
    }

    exportarExcel() {
        try {
            if (typeof XLSX === 'undefined') {
                throw new Error('Librer\u00eda XLSX no cargada.');
            }

            const wb = XLSX.utils.book_new();

            // ---- Hoja 1: Sabores ----
            const datosSabores = this.sabores.map(s => ({ Sabor: s }));
            if (datosSabores.length === 0) datosSabores.push({ Sabor: '(sin sabores)' });
            XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(datosSabores), 'Sabores');

            // ---- Hoja 2: Precios ----
            const datosPrecios = Object.keys(this.precios).map(k => ({ Key: k, Value: this.precios[k] }));
            XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(datosPrecios), 'Precios');

            // ---- Hoja 3: Ventas (UNA FILA POR VENTA, Items como JSON para reimportar) ----
            const datosVentas = [];
            (this.ventas || []).forEach(venta => {
                if (!venta) return;
                datosVentas.push({
                    'Fecha': venta.fecha,
                    'Total': venta.total,
                    'Items': JSON.stringify(venta.items || []),
                    // Columnas legibles extra (solo para visualizar en Excel)
                    'Fecha Legible': new Date(venta.fecha).toLocaleDateString('es-AR') + ' ' + new Date(venta.fecha).toLocaleTimeString('es-AR'),
                    'Descripci\u00f3n': venta.items && venta.items.length > 0 ? venta.items.map(i => i.descripcion).join(' + ') : ''
                });
            });
            if (datosVentas.length === 0) {
                datosVentas.push({ 'Fecha': '', 'Total': '', 'Items': '', 'Fecha Legible': 'Sin ventas', 'Descripci\u00f3n': '' });
            }
            XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(datosVentas), 'Ventas');

            // ---- Hoja 4: Resumen ----
            const datosResumen = [
                { Clave: 'ventasTotales', Valor: this.ventasTotales },
                { Clave: 'cantidadVentas', Valor: (this.ventas || []).length }
            ];
            XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(datosResumen), 'Resumen');

            // ---- Hoja 5: Productos Envasados ----
            const datosProductos = (this.productosEnvasados || []).map(p => ({
                'ID': p.id,
                'Nombre': p.nombre,
                'Precio': p.precio,
                'Stock': p.stock,
                'Codigo': p.barcode || ''
            }));
            if (datosProductos.length === 0) datosProductos.push({ 'ID': '', 'Nombre': '(sin productos)', 'Precio': '', 'Stock': '', 'Codigo': '' });
            XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(datosProductos), 'Productos');

            // ---- Hoja 6: Stock Insumos ----
            const datosStock = Object.keys(this.stockInsumos).map(k => ({ Clave: k, Valor: this.stockInsumos[k] }));
            XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(datosStock), 'StockInsumos');

            // Generar descarga
            const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([wbout], { type: 'application/octet-stream' });
            const fecha = new Date().toISOString().slice(0, 10);
            const filename = `Vita_Backup_${fecha}.xlsx`;

            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(blob, filename);
            } else {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
            }

            const cantVentas = (this.ventas || []).length;
            const cantProd = (this.productosEnvasados || []).length;
            this.mostrarInfo(`\u2705 Backup exportado correctamente.<br>Incluye: <b>${cantVentas}</b> ventas y <b>${cantProd}</b> productos envasados.`);
        } catch (error) {
            console.error('Error en exportarExcel:', error);
            this.mostrarError('Error al exportar Excel: ' + (error && error.message ? error.message : ''));
        }
    }

    // ============================================
    // COMPRA
    // ============================================

    actualizarTipoProducto() {
        const esGustos = document.querySelector('input[name="tipoHelado"]:checked').value === 'gustos';
        this.elementos.seccionGustos.style.display = esGustos ? 'block' : 'none';
        this.elementos.seccionPotes.style.display = esGustos ? 'none' : 'block';
    }

    actualizarEstadoSabores() {
        const numSabores = parseInt(document.querySelector('input[name="numSabores"]:checked').value);
        document.getElementById('grupo-combo2').style.display = numSabores >= 2 ? 'block' : 'none';
        document.getElementById('grupo-combo3').style.display = numSabores === 3 ? 'block' : 'none';
    }

    agregarAlCarrito() {
        try {
            const esGustos = document.querySelector('input[name="tipoHelado"]:checked').value === 'gustos';

            if (esGustos) {
                const numSabores = parseInt(document.querySelector('input[name="numSabores"]:checked').value);
                const sabor1 = this.elementos.combo1.value;
                let desc, precio;

                if (numSabores === 1) {
                    desc = `Helado 1 sabor: ${sabor1}`;
                    precio = this.precios['1_gusto'];
                } else if (numSabores === 2) {
                    const sabor2 = this.elementos.combo2.value;
                    desc = `Helado 2 sabores: ${sabor1}, ${sabor2}`;
                    precio = this.precios['2_gustos'];
                } else {
                    const sabor2 = this.elementos.combo2.value;
                    const sabor3 = this.elementos.combo3.value;
                    desc = `Helado 3 sabores: ${sabor1}, ${sabor2}, ${sabor3}`;
                    precio = this.precios['3_gustos'];
                }

                this.carrito.push({ descripcion: desc, precio: precio, tipo: 'mostrador-gusto' });
            } else {
                const tamanio = document.querySelector('input[name="tamanioPote"]:checked').value;
                let desc, precio;

                if (tamanio === '1_4') {
                    desc = 'Helado 1/4 Kg';
                    precio = this.precios['1_4kg'];
                } else if (tamanio === '1_2') {
                    desc = 'Helado 1/2 Kg';
                    precio = this.precios['1_2kg'];
                } else {
                    desc = 'Helado 1 Kg';
                    precio = this.precios['1kg'];
                }

                this.carrito.push({ descripcion: desc, precio: precio, tipo: 'mostrador-pote', subtipo: tamanio });
            }

            this.actualizarTablaCarrito();
            this.mostrarInfo('Producto agregado al carrito');
        } catch (error) {
            this.mostrarError(error.message);
        }
    }

    // Helper para verificar stock antes de venta mostrador (Opcional, alertamos al finalizar)
    verificarStockMostrador(items) {
        const necesidad = { cucuruchos: 0, potes_1_4: 0, potes_1_2: 0, potes_1kg: 0 };

        items.forEach(item => {
            if (item.tipo === 'mostrador-gusto') necesidad.cucuruchos++;
            if (item.tipo === 'mostrador-pote') {
                if (item.subtipo === '1_4') necesidad.potes_1_4++;
                if (item.subtipo === '1_2') necesidad.potes_1_2++;
                if (item.subtipo === '1kg') necesidad.potes_1kg++;
            }
        });

        const faltantes = [];
        if (necesidad.cucuruchos > this.stockInsumos.cucuruchos) faltantes.push('Cucuruchos');
        if (necesidad.potes_1_4 > this.stockInsumos.potes_1_4) faltantes.push('Potes 1/4 Kg');
        if (necesidad.potes_1_2 > this.stockInsumos.potes_1_2) faltantes.push('Potes 1/2 Kg');
        if (necesidad.potes_1kg > this.stockInsumos.potes_1kg) faltantes.push('Potes 1 Kg');

        if (faltantes.length > 0) {
            return `⚠️ Advertencia de Stock Bajo: Faltan ${faltantes.join(', ')}. ¿Desea continuar igual?`;
        }
        return null;
    }

    actualizarTablaCarrito() {
        this.elementos.cuerpoTabla.innerHTML = '';

        if (this.carrito.length === 0) {
            this.elementos.tablaCarrito.style.display = 'none';
            this.elementos.carritoVacio.style.display = 'block';
            return;
        }

        this.elementos.tablaCarrito.style.display = 'table';
        this.elementos.carritoVacio.style.display = 'none';

        this.carrito.forEach((item, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.descripcion}</td>
                <td>$${item.precio.toFixed(2)}</td>
                <td>
                    <button class="btn btn-danger btn-small" data-index="${index}">✕ Eliminar</button>
                </td>
            `;
            tr.querySelector('button').addEventListener('click', () => this.eliminarItem(index));
            this.elementos.cuerpoTabla.appendChild(tr);
        });
    }

    eliminarItem(index) {
        if (index >= 0 && index < this.carrito.length) {
            this.carrito.splice(index, 1);
            this.actualizarTablaCarrito();
        }
    }

    eliminarItemSeleccionado() {
        // Implementación si se necesita eliminar por tecla Delete
    }

    finalizarCompra() {
        if (this.carrito.length === 0) {
            this.mostrarInfo('No hay productos en el carrito');
            return;
        }

        const totalCompra = this.carrito.reduce((suma, item) => suma + item.precio, 0);
        this.ventasTotales += totalCompra;

        // Guardar venta en historial
        try {
            const venta = {
                fecha: new Date().toISOString(),
                total: totalCompra,
                items: this.carrito.map(it => ({ descripcion: it.descripcion, precio: it.precio }))
            };
            this.ventas.push(venta);
            // También guardar la última venta por compatibilidad
            localStorage.setItem('ultimaVenta', JSON.stringify(venta));
        } catch (err) {
            console.error('Error al guardar la venta en historial:', err);
        }

        // --- GESTIÓN DE STOCK (DESCUENTO) ---
        // 1. Mostrador (Insumos)
        this.carrito.forEach(item => {
            if (item.tipo === 'mostrador-gusto') {
                if (this.stockInsumos.cucuruchos > 0) this.stockInsumos.cucuruchos--;
            } else if (item.tipo === 'mostrador-pote') {
                if (item.subtipo === '1_4' && this.stockInsumos.potes_1_4 > 0) this.stockInsumos.potes_1_4--;
                else if (item.subtipo === '1_2' && this.stockInsumos.potes_1_2 > 0) this.stockInsumos.potes_1_2--;
                else if (item.subtipo === '1kg' && this.stockInsumos.potes_1kg > 0) this.stockInsumos.potes_1kg--;
            } else if (item.tipo === 'envasado') {
                // 2. Envasados
                const prod = this.productosEnvasados.find(p => p.id === item.idProducto);
                if (prod && prod.stock > 0) {
                    prod.stock--;
                }
            }
        });

        this.actualizarUIInventario(); // Refrescar UI con nuevos stocks
        // ------------------------------------

        // Mostrar resumen
        let resumen = '<div class="resumen-contenido">';
        this.carrito.forEach(item => {
            resumen += `<p>${item.descripcion} - $${item.precio.toFixed(2)}</p>`;
        });
        resumen += `<p class="total">Total: $${totalCompra.toFixed(2)}</p>`;
        resumen += '</div>';

        this.mostrarResumen(resumen, () => {
            // Limpiar carrito solo cuando se cierra el resumen
            this.carrito = [];
            this.actualizarTablaCarrito();
            this.guardarDatos();
        });
        this.actualizarTablaCarrito();
        this.guardarDatos();
    }

    verVentasTotales() {
        this.mostrarInfo(`Las ventas acumuladas son: <strong>$${this.ventasTotales.toFixed(2)}</strong>`);
    }

    // ============================================
    // VENTAS DIARIAS
    // ============================================

    renderVentasDiarias() {
        const container = this.elementos.resumenVentasDiarias;
        if (!container) return;

        const filtroFecha = this.elementos.filtroFechaVentas ? this.elementos.filtroFechaVentas.value : '';

        // Agrupar ventas por día
        const porDia = {};
        this.ventas.forEach(venta => {
            const fecha = new Date(venta.fecha);
            const dia = fecha.toLocaleDateString('es-AR', { year: 'numeric', month: '2-digit', day: '2-digit' });
            const diaKey = fecha.toISOString().slice(0, 10); // YYYY-MM-DD para filtrar

            if (filtroFecha && diaKey !== filtroFecha) return;

            if (!porDia[dia]) porDia[dia] = { total: 0, cantidad: 0 };
            porDia[dia].total += venta.total;
            porDia[dia].cantidad++;
        });

        const dias = Object.keys(porDia);
        if (dias.length === 0) {
            container.innerHTML = '<p class="empty-state">No hay ventas registradas' + (filtroFecha ? ' para esta fecha.' : '.') + '</p>';
            return;
        }

        container.innerHTML = '';
        // Ordenar por fecha descendente
        const diasOrdenados = dias.sort((a, b) => {
            const [da, ma, ya] = a.split('/'); const [db, mb, yb] = b.split('/');
            return new Date(`${yb}-${mb}-${db}`) - new Date(`${ya}-${ma}-${da}`);
        });

        diasOrdenados.forEach(dia => {
            const d = porDia[dia];
            const card = document.createElement('div');
            card.className = 'venta-dia-card';
            card.innerHTML = `
                <div class="venta-dia-fecha">📅 ${dia}</div>
                <div class="venta-dia-info">
                    <span class="venta-dia-count">${d.cantidad} venta${d.cantidad !== 1 ? 's' : ''}</span>
                    <span class="venta-dia-total">$${d.total.toFixed(2)}</span>
                </div>
            `;
            container.appendChild(card);
        });
    }

    renderHistorialVentas() {
        const tbody = this.elementos.bodyHistorialVentas;
        if (!tbody) return;
        tbody.innerHTML = '';

        if (this.ventas.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = '<td colspan="4" style="text-align:center;color:#888;padding:16px">No hay ventas registradas</td>';
            tbody.appendChild(tr);
            return;
        }

        // Mostrar desde la más reciente
        const ventasOrdenadas = [...this.ventas].reverse();
        ventasOrdenadas.forEach((venta, i) => {
            const idx = this.ventas.length - 1 - i; // índice real en this.ventas
            const tr = document.createElement('tr');
            const fecha = new Date(venta.fecha);
            const fechaStr = fecha.toLocaleDateString('es-AR') + ' ' + fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
            const desc = venta.items && venta.items.length > 0
                ? (venta.items.length === 1 ? venta.items[0].descripcion : `${venta.items[0].descripcion} (+${venta.items.length - 1} más)`)
                : 'Venta manual';
            tr.innerHTML = `
                <td style="font-size:0.9em;">${fechaStr}</td>
                <td>${desc}</td>
                <td style="font-weight:600;color:var(--color-primary);">$${venta.total.toFixed(2)}</td>
                <td style="display:flex;gap:6px;">
                    <button class="btn btn-info btn-small btn-edit-v" title="Editar">✏️</button>
                    <button class="btn btn-danger btn-small btn-del-v" title="Eliminar">✕</button>
                </td>
            `;
            tr.querySelector('.btn-edit-v').addEventListener('click', () => this.abrirEditarVenta(idx));
            tr.querySelector('.btn-del-v').addEventListener('click', () => this.eliminarVenta(idx));
            tbody.appendChild(tr);
        });
    }

    abrirEditarVenta(idx) {
        const venta = this.ventas[idx];
        if (!venta) return;
        const fecha = new Date(venta.fecha);
        // Formatear para datetime-local (YYYY-MM-DDTHH:MM)
        const fechaLocal = new Date(fecha.getTime() - fecha.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        this.elementos.editVentaIdx.value = idx;
        this.elementos.editVentaDesc.value = venta.items && venta.items.length > 0 ? venta.items[0].descripcion : '';
        this.elementos.editVentaTotal.value = venta.total;
        this.elementos.editVentaFecha.value = fechaLocal;
        this.elementos.modalEditarVenta.classList.add('active');
    }

    guardarEdicionVenta() {
        const idx = parseInt(this.elementos.editVentaIdx.value);
        const venta = this.ventas[idx];
        if (!venta) return;

        const desc = this.elementos.editVentaDesc.value.trim();
        const total = parseFloat(this.elementos.editVentaTotal.value);
        const fecha = this.elementos.editVentaFecha.value;

        if (!desc || isNaN(total) || !fecha) {
            this.mostrarError('Por favor complete todos los campos');
            return;
        }

        // Recalcular ventasTotales
        this.ventasTotales -= venta.total;
        this.ventasTotales += total;

        venta.total = total;
        venta.fecha = new Date(fecha).toISOString();
        if (venta.items && venta.items.length > 0) {
            venta.items[0].descripcion = desc;
        } else {
            venta.items = [{ descripcion: desc, precio: total }];
        }

        this.guardarDatos();
        this.cerrarModal('editarVenta');
        this.renderHistorialVentas();
        this.renderVentasDiarias();
        this.mostrarInfo('✅ Venta actualizada correctamente');
    }

    eliminarVenta(idx) {
        this.mostrarConfirmacion('¿Eliminar esta venta del historial?', () => {
            this.ventasTotales -= this.ventas[idx].total;
            if (this.ventasTotales < 0) this.ventasTotales = 0;
            this.ventas.splice(idx, 1);
            this.guardarDatos();
            this.renderHistorialVentas();
            this.renderVentasDiarias();
        });
    }

    agregarVentaManual() {
        const desc = this.elementos.ventaManualDesc ? this.elementos.ventaManualDesc.value.trim() : '';
        const precio = parseFloat(this.elementos.ventaManualPrecio ? this.elementos.ventaManualPrecio.value : '');
        const fechaStr = this.elementos.ventaManualFecha ? this.elementos.ventaManualFecha.value : '';

        if (!desc || isNaN(precio) || precio <= 0 || !fechaStr) {
            this.mostrarError('Complete todos los campos para agregar la venta manual');
            return;
        }

        const venta = {
            fecha: new Date(fechaStr).toISOString(),
            total: precio,
            items: [{ descripcion: desc, precio: precio }]
        };

        this.ventas.push(venta);
        this.ventasTotales += precio;
        this.guardarDatos();

        // Limpiar
        this.elementos.ventaManualDesc.value = '';
        this.elementos.ventaManualPrecio.value = '';
        this.elementos.ventaManualFecha.value = '';

        this.renderHistorialVentas();
        this.renderVentasDiarias();
        this.mostrarInfo('✅ Venta manual agregada correctamente');
    }

    limpiarHistorial() {
        this.mostrarConfirmacion('¿Estás seguro de que deseas eliminar TODO el historial de ventas? Esta acción no se puede deshacer.', () => {
            this.ventas = [];
            this.ventasTotales = 0;
            this.guardarDatos();
            this.renderHistorialVentas();
            this.renderVentasDiarias();
            this.mostrarInfo('Historial eliminado');
        });
    }

    imprimirTicket() {
        let itemsAImprimir = [];
        let totalAImprimir = 0;
        let fechaAImprimir = '';
        let tituloTicket = 'TICKET DE COMPRA';

        if (this.carrito.length > 0) {
            // Caso 1: Hay cosas en el carrito (Ticket Pre-venta o actual)
            itemsAImprimir = this.carrito;
            totalAImprimir = this.carrito.reduce((suma, item) => suma + item.precio, 0);
            fechaAImprimir = new Date().toLocaleDateString('es-ES') + ' ' + new Date().toLocaleTimeString('es-ES');
        } else {
            // Caso 2: Carrito vacío, buscamos la última venta
            const ultimaVentaJson = localStorage.getItem('ultimaVenta');
            if (ultimaVentaJson) {
                try {
                    const ultimaVenta = JSON.parse(ultimaVentaJson);
                    itemsAImprimir = ultimaVenta.items;
                    totalAImprimir = ultimaVenta.total;
                    // Formatear fecha guardada
                    const dateObj = new Date(ultimaVenta.fecha);
                    fechaAImprimir = dateObj.toLocaleDateString('es-ES') + ' ' + dateObj.toLocaleTimeString('es-ES');
                    tituloTicket = 'REIMPRESIÓN TICKET'; // Indicamos que es una copia

                    this.mostrarInfo('Imprimiendo ticket de la última venta registrada...');
                } catch (e) {
                    console.error('Error al leer última venta', e);
                    this.mostrarError('Error al recuperar la última venta');
                    return;
                }
            } else {
                this.mostrarError('No hay productos en el carrito ni ventas recientes para imprimir');
                return;
            }
        }

        // Crear ventana de impresión
        const ventanaImpresion = window.open('', '_blank');

        let html = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <title>Ticket de Compra</title>
                <style>
                    body {
                        font-family: 'Courier New', monospace;
                        max-width: 400px;
                        margin: 0;
                        padding: 20px;
                        background-color: #f5f5f5;
                    }
                    .ticket {
                        background-color: white;
                        padding: 20px;
                        text-align: center;
                        border: 1px solid #ddd;
                    }
                    h1 {
                        margin: 0;
                        font-size: 18px;
                        font-weight: bold;
                    }
                    .separador {
                        border-top: 2px dashed #000;
                        margin: 10px 0;
                    }
                    .fecha {
                        font-size: 12px;
                        margin: 10px 0;
                    }
                    .producto {
                        text-align: left;
                        font-size: 12px;
                        margin: 8px 0;
                        display: flex;
                        justify-content: space-between;
                    }
                    .total {
                        font-weight: bold;
                        font-size: 16px;
                        margin: 15px 0;
                        text-align: right;
                    }
                    .pie {
                        font-size: 12px;
                        margin-top: 20px;
                        font-style: italic;
                    }
                    @media print {
                        body {
                            background-color: white;
                            padding: 0;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="ticket">
                    <h1>🍦 Vita 🍦</h1>
                    <div class="separador"></div>
                    <div style="font-weight: bold;">${tituloTicket}</div>
                    <div class="separador"></div>
                    <div class="fecha">Fecha: ${fechaAImprimir}</div>
                    <div class="separador"></div>
            `;

        itemsAImprimir.forEach(item => {
            html += `
                <div class="producto">
                    <span>${item.descripcion}</span>
                    <span>$${item.precio.toFixed(2)}</span>
                </div>
            `;
        });

        html += `
                    <div class="separador"></div>
                    <div class="total">TOTAL: $${totalAImprimir.toFixed(2)}</div>
                    <div class="pie">
                        ¡Gracias por su compra!<br>
                        Vuelva pronto
                    </div>
                </div>
            </body>
            </html>
        `;

        ventanaImpresion.document.write(html);
        ventanaImpresion.document.close();

        // Esperar a que se cargue y luego imprimir
        setTimeout(() => {
            ventanaImpresion.print();
            ventanaImpresion.close();
        }, 250);

        if (this.carrito.length > 0) {
            this.mostrarInfo('Se abrió la ventana de impresión');
        }
    }

    // ============================================
    // MODALES
    // ============================================

    mostrarConfirmacion(mensaje, callback) {
        document.getElementById('textoConfirmacion').textContent = mensaje;
        this.elementos.modalConfirmacion.classList.add('active');

        // Remover cualquier event listener anterior del botón Sí
        const btnSiNuevo = this.elementos.btnConfirmarSi.cloneNode(true);
        this.elementos.btnConfirmarSi.parentNode.replaceChild(btnSiNuevo, this.elementos.btnConfirmarSi);
        this.elementos.btnConfirmarSi = btnSiNuevo;

        const handler = () => {
            this.cerrarModal('confirmacion');
            try {
                callback();
            } catch (error) {
                this.mostrarError(error.message || 'Ocurrió un error');
            }
        };

        this.elementos.btnConfirmarSi.addEventListener('click', handler, { once: true });
    }

    mostrarInfo(mensaje) {
        document.getElementById('textoInfo').innerHTML = mensaje;
        this.elementos.modalInfo.classList.add('active');
    }

    mostrarError(mensaje) {
        document.getElementById('textoError').textContent = mensaje;
        this.elementos.modalError.classList.add('active');
    }

    mostrarResumen(contenido, onCloseCallback) {
        const modalContent = document.getElementById('contenidoResumen');
        modalContent.innerHTML = contenido;

        // Agregar botón de imprimir al resumen si no existe
        let btnImprimir = document.getElementById('btnImprimirResumen');
        if (!btnImprimir) {
            const buttonsContainer = this.elementos.modalResumen.querySelector('.modal-buttons');
            btnImprimir = document.createElement('button');
            btnImprimir.id = 'btnImprimirResumen';
            btnImprimir.className = 'btn btn-warning';
            btnImprimir.textContent = '🖨️ Imprimir Ticket';
            btnImprimir.style.marginRight = '10px';
            buttonsContainer.insertBefore(btnImprimir, buttonsContainer.firstChild);
        }

        // Configurar evento de impresión para este resumen específico
        // Clonamos el botón para eliminar eventos anteriores
        const newBtn = btnImprimir.cloneNode(true);
        btnImprimir.parentNode.replaceChild(newBtn, btnImprimir);

        newBtn.addEventListener('click', () => {
            // Usar una función de impresión directa del resumen
            this.imprimirTicketDirecto(modalContent.innerHTML);
        });

        this.onResumenClose = onCloseCallback;
        this.elementos.modalResumen.classList.add('active');
    }

    imprimirTicketDirecto(htmlContent) {
        const ventanaImpresion = window.open('', '_blank');
        const fecha = new Date().toLocaleDateString('es-ES') + ' ' + new Date().toLocaleTimeString('es-ES');

        // Parsear el contenido HTML para extraer items y total (simple parsing o usar el mismo html)
        // Para simplificar, envolvemos el contenido del resumen en el formato ticket

        let ticketHtml = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <title>Ticket de Compra</title>
                <style>
                    body { font-family: 'Courier New', monospace; max-width: 400px; padding: 20px; }
                    .ticket { text-align: center; }
                    .separador { border-top: 2px dashed #000; margin: 10px 0; }
                    .fecha { font-size: 12px; margin: 10px 0; }
                    .resumen-content { text-align: left; font-size: 12px; }
                    .resumen-content p { margin: 5px 0; display: flex; justify-content: space-between; }
                    .total { font-weight: bold; font-size: 16px; margin-top: 15px; text-align: right; border-top: 1px solid #000; padding-top: 5px; }
                    .pie { font-size: 12px; margin-top: 20px; font-style: italic; }
                    @media print { body { padding: 0; } }
                </style>
            </head>
            <body>
                <div class="ticket">
                    <h1>🍦 VITA 🍦</h1>
                    <div class="separador"></div>
                    <div style="font-weight: bold;">TICKET DE COMPRA</div>
                    <div class="separador"></div>
                    <div class="fecha">Fecha: ${fecha}</div>
                    <div class="separador"></div>
                    <div class="resumen-content">
                        ${htmlContent}
                    </div>
                    <div class="separador"></div>
                    <div class="pie">¡Gracias por su compra!<br>Vuelva pronto</div>
                </div>
            </body>
            </html>
        `;

        ventanaImpresion.document.write(ticketHtml);
        ventanaImpresion.document.close();
        setTimeout(() => {
            ventanaImpresion.print();
            ventanaImpresion.close();
        }, 250);
    }

    cerrarModal(tipo) {
        const modales = {
            confirmacion: this.elementos.modalConfirmacion,
            info: this.elementos.modalInfo,
            error: this.elementos.modalError,
            resumen: this.elementos.modalResumen,
            editarArticulo: this.elementos.modalEditarArticulo,
            editarVenta: this.elementos.modalEditarVenta,
        };
        if (modales[tipo]) {
            modales[tipo].classList.remove('active');

            // Si es resumen y hay callback, ejecutarlo
            if (tipo === 'resumen' && this.onResumenClose) {
                this.onResumenClose();
                this.onResumenClose = null; // Limpiar
            }
        }
    }

    // Cerrar modales al hacer click fuera
    setupModalEvents() {
        const todosModales = [
            this.elementos.modalConfirmacion,
            this.elementos.modalInfo,
            this.elementos.modalError,
            this.elementos.modalResumen,
            this.elementos.modalEditarArticulo,
            this.elementos.modalEditarVenta,
        ].filter(Boolean);

        todosModales.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });
    }

    // Inicializar fecha de venta manual con la fecha/hora actual
    inicializarFechaVentaManual() {
        if (this.elementos.ventaManualFecha) {
            const ahora = new Date();
            const local = new Date(ahora.getTime() - ahora.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
            this.elementos.ventaManualFecha.value = local;
        }
    }
}

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM completamente cargado, inicializando aplicación...');

    // Pequeño retraso para asegurar que todo el DOM esté listo
    setTimeout(() => {
        try {
            const app = new HeladeriaApp();
            app.setupModalEvents();
            app.inicializarFechaVentaManual();

            // Forzar una actualización de la UI después de un pequeño retraso
            // para asegurar que todos los elementos del DOM estén listos
            setTimeout(() => {
                console.log('Forzando actualización de la UI...');
                app.actualizarUI();

                // Si después de 1 segundo aún no se ven los sabores, intentar de nuevo
                setTimeout(() => {
                    const listaSabores = document.getElementById('listaSabores');
                    if (listaSabores && listaSabores.children.length === 0) {
                        console.warn('La lista de sabores sigue vacía después de la inicialización, intentando nuevamente...');
                        app.actualizarListaSabores();
                    }
                }, 1000);

            }, 100);
        } catch (error) {
            console.error('Error al inicializar la aplicación:', error);
        }
    }, 100);
});
