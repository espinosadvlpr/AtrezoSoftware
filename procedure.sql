delimiter //
CREATE PROCEDURE sincInventario(
    IN tipoTransaccion CHAR(1)
)
BEGIN
    DECLARE contador INT DEFAULT 0;
    DECLARE v_cantidad_actual INT;
    DECLARE var_id_prod BigInt;
    DECLARE var_cantidad INT;		   	
    #Cursor de idProductos y cantidades de la ultima factura
    DECLARE cursor1 CURSOR FOR SELECT idProducto, cantidad FROM DetalleFactura
    WHERE idFactura = (SELECT MAX(idFactura) FROM Facturas);

    DECLARE EXIT HANDLER FOR NOT FOUND SET contador = 0;

    OPEN cursor1;
    bucle: LOOP
    FETCH cursor1 INTO var_id_prod, var_cantidad;
    	IF contador = 1 THEN LEAVE bucle;
	END IF;
        #Guardo la cantidad actual del producto en una varibale
        SELECT cantidadDisponible
        INTO v_cantidad_actual
        FROM Producto
        WHERE codigoProducto = var_id_prod;
        #Si es una venta debo restar la cantidad vendida
        IF tipoTransaccion = 'V' THEN
            UPDATE Producto
            SET cantidadDisponible = (v_cantidad_actual - var_cantidad)
            WHERE codigoProducto = var_id_prod;
        #Si es una compra debo sumar la cantidad comprada
        ELSEIF tipoTransaccion = 'C' THEN
            UPDATE Producto
            SET cantidadDisponible = (v_cantidad_actual + var_cantidad)
            WHERE codigoProducto = var_id_prod;
        END IF;
    END LOOP bucle;
    CLOSE cursor1;
END;//
delimiter ;
