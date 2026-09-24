package com.tonight.app.ui.components

import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.SheetState
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import com.tonight.app.ui.theme.SheetTopShape
import com.tonight.app.ui.theme.TonightTheme

/**
 * CalmBottomSheet:
 * Light-first bottom sheet using 40dp top radius and white surface.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CalmBottomSheet(
    onDismissRequest: () -> Unit,
    modifier: Modifier = Modifier,
    sheetState: SheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true),
    content: @Composable ColumnScope.() -> Unit
) {
    ModalBottomSheet(
        onDismissRequest = onDismissRequest,
        sheetState = sheetState,
        modifier = modifier,
        shape = SheetTopShape,
        containerColor = TonightTheme.colors.surface,
        scrimColor = Color(0x33000000),
        dragHandle = null,
        content = {
            BottomSheetSurface(modifier = Modifier.fillMaxWidth()) {
                this@ModalBottomSheet.content()
            }
        }
    )
}
