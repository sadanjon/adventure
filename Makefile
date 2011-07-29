JS=adventure.js Err.js Surface.js ui.js stage.js Animation.js room.js Guy.js main.js
TARGET_DEBUG=adventure_debug.js
TARGET_RELEASE=adventure_release.js

debug: $(TARGET_DEBUG)

release: $(TARGET_RELEASE)

$(TARGET_DEBUG): $(JS)
	rm -f $(TARGET_DEBUG)
	cat $^ > $@

$(TARGET_RELEASE): $(JS)
	rm -f $(TARGET_RELEASE)
	cat $^ | java -jar yuicompressor-*.jar --type js -o $(TARGET_RELEASE)
