sed -i -e '48,50c\
        <div class="slot-name">${name} <span class="slot-meta" style="color:#aaa; font-size:0.85em; font-weight:normal;">(Lv ${slot.level || 1} ${escHtml(slot.class || '"'"'Adventurer'"'"')})</span></div>\
        <div class="slot-detail">${escHtml(slot.location || '"'"'Unknown Location'"'"')}</div>\
        <div class="slot-detail">Turn ${turn} \&bull; ${escHtml(date)}</div>' src/save-slots-ui.js
