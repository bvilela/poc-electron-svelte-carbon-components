
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function compute_slots(slots) {
        const result = {};
        for (const key in slots) {
            result[key] = true;
        }
        return result;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function set_svg_attributes(node, attributes) {
        for (const key in attributes) {
            attr(node, key, attributes[key]);
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
     * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
     * it can be called from an external module).
     *
     * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
     *
     * https://svelte.dev/docs#run-time-svelte-onmount
     */
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    /**
     * Schedules a callback to run immediately before the component is unmounted.
     *
     * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
     * only one that runs inside a server-side component.
     *
     * https://svelte.dev/docs#run-time-svelte-ondestroy
     */
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    /**
     * Creates an event dispatcher that can be used to dispatch [component events](/docs#template-syntax-component-directives-on-eventname).
     * Event dispatchers are functions that can take two arguments: `name` and `detail`.
     *
     * Component events created with `createEventDispatcher` create a
     * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
     * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
     * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
     * property and can contain any type of data.
     *
     * https://svelte.dev/docs#run-time-svelte-createeventdispatcher
     */
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    /**
     * Retrieves the context that belongs to the closest parent component with the specified `key`.
     * Must be called during component initialisation.
     *
     * https://svelte.dev/docs#run-time-svelte-getcontext
     */
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    let render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = /* @__PURE__ */ Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    /**
     * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
     */
    function flush_render_callbacks(fns) {
        const filtered = [];
        const targets = [];
        render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
        targets.forEach((c) => c());
        render_callbacks = filtered;
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        const updates = [];
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                // defer updates until all the DOM shuffling is done
                updates.push(() => block.p(child_ctx, dirty));
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        run_all(updates);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            flush_render_callbacks($$.after_update);
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.57.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        if (has_stop_immediate_propagation)
            modifiers.push('stopImmediatePropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    function construct_svelte_component_dev(component, props) {
        const error_message = 'this={...} of <svelte:component> should specify a Svelte component.';
        try {
            const instance = new component(props);
            if (!instance.$$ || !instance.$set || !instance.$on || !instance.$destroy) {
                throw new Error(error_message);
            }
            return instance;
        }
        catch (err) {
            const { message } = err;
            if (typeof message === 'string' && message.indexOf('is not a constructor') !== -1) {
                throw new Error(error_message);
            }
            else {
                throw err;
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0 && stop) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    /* node_modules\carbon-components-svelte\src\Button\ButtonSkeleton.svelte generated by Svelte v3.57.0 */

    const file$j = "node_modules\\carbon-components-svelte\\src\\Button\\ButtonSkeleton.svelte";

    // (35:0) {:else}
    function create_else_block$2(ctx) {
    	let div;
    	let mounted;
    	let dispose;
    	let div_levels = [/*$$restProps*/ ctx[2]];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			set_attributes(div, div_data);
    			toggle_class(div, "bx--skeleton", true);
    			toggle_class(div, "bx--btn", true);
    			toggle_class(div, "bx--btn--field", /*size*/ ctx[1] === 'field');
    			toggle_class(div, "bx--btn--sm", /*size*/ ctx[1] === 'small');
    			toggle_class(div, "bx--btn--lg", /*size*/ ctx[1] === 'lg');
    			toggle_class(div, "bx--btn--xl", /*size*/ ctx[1] === 'xl');
    			add_location(div, file$j, 35, 2, 801);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "click", /*click_handler_1*/ ctx[7], false, false, false, false),
    					listen_dev(div, "mouseover", /*mouseover_handler_1*/ ctx[8], false, false, false, false),
    					listen_dev(div, "mouseenter", /*mouseenter_handler_1*/ ctx[9], false, false, false, false),
    					listen_dev(div, "mouseleave", /*mouseleave_handler_1*/ ctx[10], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(div, div_data = get_spread_update(div_levels, [dirty & /*$$restProps*/ 4 && /*$$restProps*/ ctx[2]]));
    			toggle_class(div, "bx--skeleton", true);
    			toggle_class(div, "bx--btn", true);
    			toggle_class(div, "bx--btn--field", /*size*/ ctx[1] === 'field');
    			toggle_class(div, "bx--btn--sm", /*size*/ ctx[1] === 'small');
    			toggle_class(div, "bx--btn--lg", /*size*/ ctx[1] === 'lg');
    			toggle_class(div, "bx--btn--xl", /*size*/ ctx[1] === 'xl');
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(35:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (16:0) {#if href}
    function create_if_block$d(ctx) {
    	let a;
    	let t_value = "" + "";
    	let t;
    	let a_rel_value;
    	let mounted;
    	let dispose;

    	let a_levels = [
    		{ href: /*href*/ ctx[0] },
    		{
    			rel: a_rel_value = /*$$restProps*/ ctx[2].target === '_blank'
    			? 'noopener noreferrer'
    			: undefined
    		},
    		{ role: "button" },
    		/*$$restProps*/ ctx[2]
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text(t_value);
    			set_attributes(a, a_data);
    			toggle_class(a, "bx--skeleton", true);
    			toggle_class(a, "bx--btn", true);
    			toggle_class(a, "bx--btn--field", /*size*/ ctx[1] === 'field');
    			toggle_class(a, "bx--btn--sm", /*size*/ ctx[1] === 'small');
    			toggle_class(a, "bx--btn--lg", /*size*/ ctx[1] === 'lg');
    			toggle_class(a, "bx--btn--xl", /*size*/ ctx[1] === 'xl');
    			add_location(a, file$j, 16, 2, 337);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);

    			if (!mounted) {
    				dispose = [
    					listen_dev(a, "click", /*click_handler*/ ctx[3], false, false, false, false),
    					listen_dev(a, "mouseover", /*mouseover_handler*/ ctx[4], false, false, false, false),
    					listen_dev(a, "mouseenter", /*mouseenter_handler*/ ctx[5], false, false, false, false),
    					listen_dev(a, "mouseleave", /*mouseleave_handler*/ ctx[6], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				dirty & /*href*/ 1 && { href: /*href*/ ctx[0] },
    				dirty & /*$$restProps*/ 4 && a_rel_value !== (a_rel_value = /*$$restProps*/ ctx[2].target === '_blank'
    				? 'noopener noreferrer'
    				: undefined) && { rel: a_rel_value },
    				{ role: "button" },
    				dirty & /*$$restProps*/ 4 && /*$$restProps*/ ctx[2]
    			]));

    			toggle_class(a, "bx--skeleton", true);
    			toggle_class(a, "bx--btn", true);
    			toggle_class(a, "bx--btn--field", /*size*/ ctx[1] === 'field');
    			toggle_class(a, "bx--btn--sm", /*size*/ ctx[1] === 'small');
    			toggle_class(a, "bx--btn--lg", /*size*/ ctx[1] === 'lg');
    			toggle_class(a, "bx--btn--xl", /*size*/ ctx[1] === 'xl');
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$d.name,
    		type: "if",
    		source: "(16:0) {#if href}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$k(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*href*/ ctx[0]) return create_if_block$d;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	const omit_props_names = ["href","size"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ButtonSkeleton', slots, []);
    	let { href = undefined } = $$props;
    	let { size = "default" } = $$props;

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(2, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('href' in $$new_props) $$invalidate(0, href = $$new_props.href);
    		if ('size' in $$new_props) $$invalidate(1, size = $$new_props.size);
    	};

    	$$self.$capture_state = () => ({ href, size });

    	$$self.$inject_state = $$new_props => {
    		if ('href' in $$props) $$invalidate(0, href = $$new_props.href);
    		if ('size' in $$props) $$invalidate(1, size = $$new_props.size);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		href,
    		size,
    		$$restProps,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		click_handler_1,
    		mouseover_handler_1,
    		mouseenter_handler_1,
    		mouseleave_handler_1
    	];
    }

    class ButtonSkeleton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, { href: 0, size: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ButtonSkeleton",
    			options,
    			id: create_fragment$k.name
    		});
    	}

    	get href() {
    		throw new Error("<ButtonSkeleton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<ButtonSkeleton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<ButtonSkeleton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<ButtonSkeleton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var ButtonSkeleton$1 = ButtonSkeleton;

    /* node_modules\carbon-components-svelte\src\Button\Button.svelte generated by Svelte v3.57.0 */
    const file$i = "node_modules\\carbon-components-svelte\\src\\Button\\Button.svelte";
    const get_default_slot_changes$1 = dirty => ({ props: dirty[0] & /*buttonProps*/ 512 });
    const get_default_slot_context$1 = ctx => ({ props: /*buttonProps*/ ctx[9] });

    // (163:0) {:else}
    function create_else_block$1(ctx) {
    	let button;
    	let t;
    	let switch_instance;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*hasIconOnly*/ ctx[8] && create_if_block_4$1(ctx);
    	const default_slot_template = /*#slots*/ ctx[19].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], null);
    	var switch_value = /*icon*/ ctx[2];

    	function switch_props(ctx) {
    		return {
    			props: {
    				"aria-hidden": "true",
    				class: "bx--btn__icon",
    				style: /*hasIconOnly*/ ctx[8] ? 'margin-left: 0' : undefined,
    				"aria-label": /*iconDescription*/ ctx[3]
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    	}

    	let button_levels = [/*buttonProps*/ ctx[9]];
    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (if_block) if_block.c();
    			t = space();
    			if (default_slot) default_slot.c();
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			set_attributes(button, button_data);
    			add_location(button, file$i, 163, 2, 4429);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			if (if_block) if_block.m(button, null);
    			append_dev(button, t);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			if (switch_instance) mount_component(switch_instance, button, null);
    			if (button.autofocus) button.focus();
    			/*button_binding*/ ctx[33](button);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*click_handler_2*/ ctx[24], false, false, false, false),
    					listen_dev(button, "mouseover", /*mouseover_handler_2*/ ctx[25], false, false, false, false),
    					listen_dev(button, "mouseenter", /*mouseenter_handler_2*/ ctx[26], false, false, false, false),
    					listen_dev(button, "mouseleave", /*mouseleave_handler_2*/ ctx[27], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*hasIconOnly*/ ctx[8]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_4$1(ctx);
    					if_block.c();
    					if_block.m(button, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope*/ 262144)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, null),
    						null
    					);
    				}
    			}

    			const switch_instance_changes = {};
    			if (dirty[0] & /*hasIconOnly*/ 256) switch_instance_changes.style = /*hasIconOnly*/ ctx[8] ? 'margin-left: 0' : undefined;
    			if (dirty[0] & /*iconDescription*/ 8) switch_instance_changes["aria-label"] = /*iconDescription*/ ctx[3];

    			if (dirty[0] & /*icon*/ 4 && switch_value !== (switch_value = /*icon*/ ctx[2])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, button, null);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}

    			set_attributes(button, button_data = get_spread_update(button_levels, [dirty[0] & /*buttonProps*/ 512 && /*buttonProps*/ ctx[9]]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (if_block) if_block.d();
    			if (default_slot) default_slot.d(detaching);
    			if (switch_instance) destroy_component(switch_instance);
    			/*button_binding*/ ctx[33](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(163:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (143:28) 
    function create_if_block_2$1(ctx) {
    	let a;
    	let t;
    	let switch_instance;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*hasIconOnly*/ ctx[8] && create_if_block_3$1(ctx);
    	const default_slot_template = /*#slots*/ ctx[19].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], null);
    	var switch_value = /*icon*/ ctx[2];

    	function switch_props(ctx) {
    		return {
    			props: {
    				"aria-hidden": "true",
    				class: "bx--btn__icon",
    				"aria-label": /*iconDescription*/ ctx[3]
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    	}

    	let a_levels = [/*buttonProps*/ ctx[9]];
    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (if_block) if_block.c();
    			t = space();
    			if (default_slot) default_slot.c();
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			set_attributes(a, a_data);
    			add_location(a, file$i, 144, 2, 4046);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			if (if_block) if_block.m(a, null);
    			append_dev(a, t);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			if (switch_instance) mount_component(switch_instance, a, null);
    			/*a_binding*/ ctx[32](a);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(a, "click", /*click_handler_1*/ ctx[20], false, false, false, false),
    					listen_dev(a, "mouseover", /*mouseover_handler_1*/ ctx[21], false, false, false, false),
    					listen_dev(a, "mouseenter", /*mouseenter_handler_1*/ ctx[22], false, false, false, false),
    					listen_dev(a, "mouseleave", /*mouseleave_handler_1*/ ctx[23], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*hasIconOnly*/ ctx[8]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_3$1(ctx);
    					if_block.c();
    					if_block.m(a, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope*/ 262144)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, null),
    						null
    					);
    				}
    			}

    			const switch_instance_changes = {};
    			if (dirty[0] & /*iconDescription*/ 8) switch_instance_changes["aria-label"] = /*iconDescription*/ ctx[3];

    			if (dirty[0] & /*icon*/ 4 && switch_value !== (switch_value = /*icon*/ ctx[2])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, a, null);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [dirty[0] & /*buttonProps*/ 512 && /*buttonProps*/ ctx[9]]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (if_block) if_block.d();
    			if (default_slot) default_slot.d(detaching);
    			if (switch_instance) destroy_component(switch_instance);
    			/*a_binding*/ ctx[32](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(143:28) ",
    		ctx
    	});

    	return block;
    }

    // (141:13) 
    function create_if_block_1$3(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[19].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], get_default_slot_context$1);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope, buttonProps*/ 262656)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, get_default_slot_changes$1),
    						get_default_slot_context$1
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(141:13) ",
    		ctx
    	});

    	return block;
    }

    // (130:0) {#if skeleton}
    function create_if_block$c(ctx) {
    	let buttonskeleton;
    	let current;

    	const buttonskeleton_spread_levels = [
    		{ href: /*href*/ ctx[7] },
    		{ size: /*size*/ ctx[1] },
    		/*$$restProps*/ ctx[10],
    		{
    			style: /*hasIconOnly*/ ctx[8] && 'width: 3rem;'
    		}
    	];

    	let buttonskeleton_props = {};

    	for (let i = 0; i < buttonskeleton_spread_levels.length; i += 1) {
    		buttonskeleton_props = assign(buttonskeleton_props, buttonskeleton_spread_levels[i]);
    	}

    	buttonskeleton = new ButtonSkeleton$1({
    			props: buttonskeleton_props,
    			$$inline: true
    		});

    	buttonskeleton.$on("click", /*click_handler*/ ctx[28]);
    	buttonskeleton.$on("mouseover", /*mouseover_handler*/ ctx[29]);
    	buttonskeleton.$on("mouseenter", /*mouseenter_handler*/ ctx[30]);
    	buttonskeleton.$on("mouseleave", /*mouseleave_handler*/ ctx[31]);

    	const block = {
    		c: function create() {
    			create_component(buttonskeleton.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(buttonskeleton, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const buttonskeleton_changes = (dirty[0] & /*href, size, $$restProps, hasIconOnly*/ 1410)
    			? get_spread_update(buttonskeleton_spread_levels, [
    					dirty[0] & /*href*/ 128 && { href: /*href*/ ctx[7] },
    					dirty[0] & /*size*/ 2 && { size: /*size*/ ctx[1] },
    					dirty[0] & /*$$restProps*/ 1024 && get_spread_object(/*$$restProps*/ ctx[10]),
    					dirty[0] & /*hasIconOnly*/ 256 && {
    						style: /*hasIconOnly*/ ctx[8] && 'width: 3rem;'
    					}
    				])
    			: {};

    			buttonskeleton.$set(buttonskeleton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(buttonskeleton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(buttonskeleton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(buttonskeleton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$c.name,
    		type: "if",
    		source: "(130:0) {#if skeleton}",
    		ctx
    	});

    	return block;
    }

    // (172:4) {#if hasIconOnly}
    function create_if_block_4$1(ctx) {
    	let span;
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(/*iconDescription*/ ctx[3]);
    			toggle_class(span, "bx--assistive-text", true);
    			add_location(span, file$i, 172, 6, 4578);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*iconDescription*/ 8) set_data_dev(t, /*iconDescription*/ ctx[3]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(172:4) {#if hasIconOnly}",
    		ctx
    	});

    	return block;
    }

    // (153:4) {#if hasIconOnly}
    function create_if_block_3$1(ctx) {
    	let span;
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(/*iconDescription*/ ctx[3]);
    			toggle_class(span, "bx--assistive-text", true);
    			add_location(span, file$i, 153, 6, 4190);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*iconDescription*/ 8) set_data_dev(t, /*iconDescription*/ ctx[3]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(153:4) {#if hasIconOnly}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$j(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$c, create_if_block_1$3, create_if_block_2$1, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*skeleton*/ ctx[5]) return 0;
    		if (/*as*/ ctx[4]) return 1;
    		if (/*href*/ ctx[7] && !/*disabled*/ ctx[6]) return 2;
    		return 3;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let hasIconOnly;
    	let buttonProps;

    	const omit_props_names = [
    		"kind","size","expressive","isSelected","icon","iconDescription","tooltipAlignment","tooltipPosition","as","skeleton","disabled","href","tabindex","type","ref"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button', slots, ['default']);
    	const $$slots = compute_slots(slots);
    	let { kind = "primary" } = $$props;
    	let { size = "default" } = $$props;
    	let { expressive = false } = $$props;
    	let { isSelected = false } = $$props;
    	let { icon = undefined } = $$props;
    	let { iconDescription = undefined } = $$props;
    	let { tooltipAlignment = "center" } = $$props;
    	let { tooltipPosition = "bottom" } = $$props;
    	let { as = false } = $$props;
    	let { skeleton = false } = $$props;
    	let { disabled = false } = $$props;
    	let { href = undefined } = $$props;
    	let { tabindex = "0" } = $$props;
    	let { type = "button" } = $$props;
    	let { ref = null } = $$props;
    	const ctx = getContext("ComposedModal");

    	function click_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function a_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			ref = $$value;
    			$$invalidate(0, ref);
    		});
    	}

    	function button_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			ref = $$value;
    			$$invalidate(0, ref);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(10, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('kind' in $$new_props) $$invalidate(11, kind = $$new_props.kind);
    		if ('size' in $$new_props) $$invalidate(1, size = $$new_props.size);
    		if ('expressive' in $$new_props) $$invalidate(12, expressive = $$new_props.expressive);
    		if ('isSelected' in $$new_props) $$invalidate(13, isSelected = $$new_props.isSelected);
    		if ('icon' in $$new_props) $$invalidate(2, icon = $$new_props.icon);
    		if ('iconDescription' in $$new_props) $$invalidate(3, iconDescription = $$new_props.iconDescription);
    		if ('tooltipAlignment' in $$new_props) $$invalidate(14, tooltipAlignment = $$new_props.tooltipAlignment);
    		if ('tooltipPosition' in $$new_props) $$invalidate(15, tooltipPosition = $$new_props.tooltipPosition);
    		if ('as' in $$new_props) $$invalidate(4, as = $$new_props.as);
    		if ('skeleton' in $$new_props) $$invalidate(5, skeleton = $$new_props.skeleton);
    		if ('disabled' in $$new_props) $$invalidate(6, disabled = $$new_props.disabled);
    		if ('href' in $$new_props) $$invalidate(7, href = $$new_props.href);
    		if ('tabindex' in $$new_props) $$invalidate(16, tabindex = $$new_props.tabindex);
    		if ('type' in $$new_props) $$invalidate(17, type = $$new_props.type);
    		if ('ref' in $$new_props) $$invalidate(0, ref = $$new_props.ref);
    		if ('$$scope' in $$new_props) $$invalidate(18, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		kind,
    		size,
    		expressive,
    		isSelected,
    		icon,
    		iconDescription,
    		tooltipAlignment,
    		tooltipPosition,
    		as,
    		skeleton,
    		disabled,
    		href,
    		tabindex,
    		type,
    		ref,
    		getContext,
    		ButtonSkeleton: ButtonSkeleton$1,
    		ctx,
    		hasIconOnly,
    		buttonProps
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('kind' in $$props) $$invalidate(11, kind = $$new_props.kind);
    		if ('size' in $$props) $$invalidate(1, size = $$new_props.size);
    		if ('expressive' in $$props) $$invalidate(12, expressive = $$new_props.expressive);
    		if ('isSelected' in $$props) $$invalidate(13, isSelected = $$new_props.isSelected);
    		if ('icon' in $$props) $$invalidate(2, icon = $$new_props.icon);
    		if ('iconDescription' in $$props) $$invalidate(3, iconDescription = $$new_props.iconDescription);
    		if ('tooltipAlignment' in $$props) $$invalidate(14, tooltipAlignment = $$new_props.tooltipAlignment);
    		if ('tooltipPosition' in $$props) $$invalidate(15, tooltipPosition = $$new_props.tooltipPosition);
    		if ('as' in $$props) $$invalidate(4, as = $$new_props.as);
    		if ('skeleton' in $$props) $$invalidate(5, skeleton = $$new_props.skeleton);
    		if ('disabled' in $$props) $$invalidate(6, disabled = $$new_props.disabled);
    		if ('href' in $$props) $$invalidate(7, href = $$new_props.href);
    		if ('tabindex' in $$props) $$invalidate(16, tabindex = $$new_props.tabindex);
    		if ('type' in $$props) $$invalidate(17, type = $$new_props.type);
    		if ('ref' in $$props) $$invalidate(0, ref = $$new_props.ref);
    		if ('hasIconOnly' in $$props) $$invalidate(8, hasIconOnly = $$new_props.hasIconOnly);
    		if ('buttonProps' in $$props) $$invalidate(9, buttonProps = $$new_props.buttonProps);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*ref*/ 1) {
    			if (ctx && ref) {
    				ctx.declareRef(ref);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*icon*/ 4) {
    			$$invalidate(8, hasIconOnly = icon && !$$slots.default);
    		}

    		$$invalidate(9, buttonProps = {
    			type: href && !disabled ? undefined : type,
    			tabindex,
    			disabled: disabled === true ? true : undefined,
    			href,
    			"aria-pressed": hasIconOnly && kind === "ghost" && !href
    			? isSelected
    			: undefined,
    			...$$restProps,
    			class: [
    				"bx--btn",
    				expressive && "bx--btn--expressive",
    				(size === "small" && !expressive || size === "sm" && !expressive || size === "small" && !expressive) && "bx--btn--sm",
    				size === "field" && !expressive || size === "md" && !expressive && "bx--btn--md",
    				size === "field" && "bx--btn--field",
    				size === "small" && "bx--btn--sm",
    				size === "lg" && "bx--btn--lg",
    				size === "xl" && "bx--btn--xl",
    				kind && `bx--btn--${kind}`,
    				disabled && "bx--btn--disabled",
    				hasIconOnly && "bx--btn--icon-only",
    				hasIconOnly && "bx--tooltip__trigger",
    				hasIconOnly && "bx--tooltip--a11y",
    				hasIconOnly && tooltipPosition && `bx--btn--icon-only--${tooltipPosition}`,
    				hasIconOnly && tooltipAlignment && `bx--tooltip--align-${tooltipAlignment}`,
    				hasIconOnly && isSelected && kind === "ghost" && "bx--btn--selected",
    				$$restProps.class
    			].filter(Boolean).join(" ")
    		});
    	};

    	return [
    		ref,
    		size,
    		icon,
    		iconDescription,
    		as,
    		skeleton,
    		disabled,
    		href,
    		hasIconOnly,
    		buttonProps,
    		$$restProps,
    		kind,
    		expressive,
    		isSelected,
    		tooltipAlignment,
    		tooltipPosition,
    		tabindex,
    		type,
    		$$scope,
    		slots,
    		click_handler_1,
    		mouseover_handler_1,
    		mouseenter_handler_1,
    		mouseleave_handler_1,
    		click_handler_2,
    		mouseover_handler_2,
    		mouseenter_handler_2,
    		mouseleave_handler_2,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		a_binding,
    		button_binding
    	];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$j,
    			create_fragment$j,
    			safe_not_equal,
    			{
    				kind: 11,
    				size: 1,
    				expressive: 12,
    				isSelected: 13,
    				icon: 2,
    				iconDescription: 3,
    				tooltipAlignment: 14,
    				tooltipPosition: 15,
    				as: 4,
    				skeleton: 5,
    				disabled: 6,
    				href: 7,
    				tabindex: 16,
    				type: 17,
    				ref: 0
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$j.name
    		});
    	}

    	get kind() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set kind(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get expressive() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set expressive(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isSelected() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isSelected(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get icon() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconDescription() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconDescription(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tooltipAlignment() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tooltipAlignment(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tooltipPosition() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tooltipPosition(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get as() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set as(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get skeleton() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set skeleton(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tabindex() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tabindex(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ref() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Button$1 = Button;

    /* node_modules\carbon-components-svelte\src\icons\WarningFilled.svelte generated by Svelte v3.57.0 */

    const file$h = "node_modules\\carbon-components-svelte\\src\\icons\\WarningFilled.svelte";

    // (24:2) {#if title}
    function create_if_block$b(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[1]);
    			add_location(title_1, file$h, 23, 13, 549);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 2) set_data_dev(t, /*title*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(24:2) {#if title}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let svg;
    	let path0;
    	let path1;
    	let if_block = /*title*/ ctx[1] && create_if_block$b(ctx);

    	let svg_levels = [
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 32 32" },
    		{ fill: "currentColor" },
    		{ preserveAspectRatio: "xMidYMid meet" },
    		{ width: /*size*/ ctx[0] },
    		{ height: /*size*/ ctx[0] },
    		/*attributes*/ ctx[2],
    		/*$$restProps*/ ctx[3]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			if (if_block) if_block.c();
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M16,2C8.3,2,2,8.3,2,16s6.3,14,14,14s14-6.3,14-14C30,8.3,23.7,2,16,2z M14.9,8h2.2v11h-2.2V8z M16,25\tc-0.8,0-1.5-0.7-1.5-1.5S15.2,22,16,22c0.8,0,1.5,0.7,1.5,1.5S16.8,25,16,25z");
    			add_location(path0, file$h, 24, 2, 579);
    			attr_dev(path1, "fill", "none");
    			attr_dev(path1, "d", "M17.5,23.5c0,0.8-0.7,1.5-1.5,1.5c-0.8,0-1.5-0.7-1.5-1.5S15.2,22,16,22\tC16.8,22,17.5,22.7,17.5,23.5z M17.1,8h-2.2v11h2.2V8z");
    			attr_dev(path1, "data-icon-path", "inner-path");
    			attr_dev(path1, "opacity", "0");
    			add_location(path1, file$h, 26, 10, 777);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$h, 13, 0, 338);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			if (if_block) if_block.m(svg, null);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*title*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$b(ctx);
    					if_block.c();
    					if_block.m(svg, path0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 32 32" },
    				{ fill: "currentColor" },
    				{ preserveAspectRatio: "xMidYMid meet" },
    				dirty & /*size*/ 1 && { width: /*size*/ ctx[0] },
    				dirty & /*size*/ 1 && { height: /*size*/ ctx[0] },
    				dirty & /*attributes*/ 4 && /*attributes*/ ctx[2],
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let labelled;
    	let attributes;
    	const omit_props_names = ["size","title"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('WarningFilled', slots, []);
    	let { size = 16 } = $$props;
    	let { title = undefined } = $$props;

    	$$self.$$set = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('size' in $$new_props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$new_props) $$invalidate(1, title = $$new_props.title);
    	};

    	$$self.$capture_state = () => ({ size, title, labelled, attributes });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), $$new_props));
    		if ('size' in $$props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$props) $$invalidate(1, title = $$new_props.title);
    		if ('labelled' in $$props) $$invalidate(4, labelled = $$new_props.labelled);
    		if ('attributes' in $$props) $$invalidate(2, attributes = $$new_props.attributes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(4, labelled = $$props["aria-label"] || $$props["aria-labelledby"] || title);

    		$$invalidate(2, attributes = {
    			"aria-hidden": labelled ? undefined : true,
    			role: labelled ? "img" : undefined,
    			focusable: Number($$props["tabindex"]) === 0 ? true : undefined
    		});
    	};

    	$$props = exclude_internal_props($$props);
    	return [size, title, attributes, $$restProps, labelled];
    }

    class WarningFilled extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, { size: 0, title: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "WarningFilled",
    			options,
    			id: create_fragment$i.name
    		});
    	}

    	get size() {
    		throw new Error("<WarningFilled>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<WarningFilled>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<WarningFilled>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<WarningFilled>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var WarningFilled$1 = WarningFilled;

    /* node_modules\carbon-components-svelte\src\icons\WarningAltFilled.svelte generated by Svelte v3.57.0 */

    const file$g = "node_modules\\carbon-components-svelte\\src\\icons\\WarningAltFilled.svelte";

    // (24:2) {#if title}
    function create_if_block$a(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[1]);
    			add_location(title_1, file$g, 23, 13, 549);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 2) set_data_dev(t, /*title*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(24:2) {#if title}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let svg;
    	let path0;
    	let path1;
    	let path2;
    	let if_block = /*title*/ ctx[1] && create_if_block$a(ctx);

    	let svg_levels = [
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 32 32" },
    		{ fill: "currentColor" },
    		{ preserveAspectRatio: "xMidYMid meet" },
    		{ width: /*size*/ ctx[0] },
    		{ height: /*size*/ ctx[0] },
    		/*attributes*/ ctx[2],
    		/*$$restProps*/ ctx[3]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			if (if_block) if_block.c();
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			path2 = svg_element("path");
    			attr_dev(path0, "fill", "none");
    			attr_dev(path0, "d", "M16,26a1.5,1.5,0,1,1,1.5-1.5A1.5,1.5,0,0,1,16,26Zm-1.125-5h2.25V12h-2.25Z");
    			attr_dev(path0, "data-icon-path", "inner-path");
    			add_location(path0, file$g, 24, 2, 579);
    			attr_dev(path1, "d", "M16.002,6.1714h-.004L4.6487,27.9966,4.6506,28H27.3494l.0019-.0034ZM14.875,12h2.25v9h-2.25ZM16,26a1.5,1.5,0,1,1,1.5-1.5A1.5,1.5,0,0,1,16,26Z");
    			add_location(path1, file$g, 27, 39, 722);
    			attr_dev(path2, "d", "M29,30H3a1,1,0,0,1-.8872-1.4614l13-25a1,1,0,0,1,1.7744,0l13,25A1,1,0,0,1,29,30ZM4.6507,28H27.3493l.002-.0033L16.002,6.1714h-.004L4.6487,27.9967Z");
    			add_location(path2, file$g, 29, 10, 886);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$g, 13, 0, 338);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			if (if_block) if_block.m(svg, null);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    			append_dev(svg, path2);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*title*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$a(ctx);
    					if_block.c();
    					if_block.m(svg, path0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 32 32" },
    				{ fill: "currentColor" },
    				{ preserveAspectRatio: "xMidYMid meet" },
    				dirty & /*size*/ 1 && { width: /*size*/ ctx[0] },
    				dirty & /*size*/ 1 && { height: /*size*/ ctx[0] },
    				dirty & /*attributes*/ 4 && /*attributes*/ ctx[2],
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let labelled;
    	let attributes;
    	const omit_props_names = ["size","title"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('WarningAltFilled', slots, []);
    	let { size = 16 } = $$props;
    	let { title = undefined } = $$props;

    	$$self.$$set = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('size' in $$new_props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$new_props) $$invalidate(1, title = $$new_props.title);
    	};

    	$$self.$capture_state = () => ({ size, title, labelled, attributes });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), $$new_props));
    		if ('size' in $$props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$props) $$invalidate(1, title = $$new_props.title);
    		if ('labelled' in $$props) $$invalidate(4, labelled = $$new_props.labelled);
    		if ('attributes' in $$props) $$invalidate(2, attributes = $$new_props.attributes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(4, labelled = $$props["aria-label"] || $$props["aria-labelledby"] || title);

    		$$invalidate(2, attributes = {
    			"aria-hidden": labelled ? undefined : true,
    			role: labelled ? "img" : undefined,
    			focusable: Number($$props["tabindex"]) === 0 ? true : undefined
    		});
    	};

    	$$props = exclude_internal_props($$props);
    	return [size, title, attributes, $$restProps, labelled];
    }

    class WarningAltFilled extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, { size: 0, title: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "WarningAltFilled",
    			options,
    			id: create_fragment$h.name
    		});
    	}

    	get size() {
    		throw new Error("<WarningAltFilled>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<WarningAltFilled>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<WarningAltFilled>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<WarningAltFilled>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var WarningAltFilled$1 = WarningAltFilled;

    /* node_modules\carbon-components-svelte\src\ListBox\ListBox.svelte generated by Svelte v3.57.0 */

    const file$f = "node_modules\\carbon-components-svelte\\src\\ListBox\\ListBox.svelte";

    // (59:0) {#if invalid}
    function create_if_block_1$2(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*invalidText*/ ctx[6]);
    			toggle_class(div, "bx--form-requirement", true);
    			add_location(div, file$f, 59, 2, 1374);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*invalidText*/ 64) set_data_dev(t, /*invalidText*/ ctx[6]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(59:0) {#if invalid}",
    		ctx
    	});

    	return block;
    }

    // (62:0) {#if !invalid && warn}
    function create_if_block$9(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*warnText*/ ctx[8]);
    			toggle_class(div, "bx--form-requirement", true);
    			add_location(div, file$f, 62, 2, 1466);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*warnText*/ 256) set_data_dev(t, /*warnText*/ ctx[8]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(62:0) {#if !invalid && warn}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let div;
    	let div_data_invalid_value;
    	let t0;
    	let t1;
    	let if_block1_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[10], null);

    	let div_levels = [
    		{ role: "listbox" },
    		{ tabindex: "-1" },
    		{
    			"data-invalid": div_data_invalid_value = /*invalid*/ ctx[5] || undefined
    		},
    		/*$$restProps*/ ctx[9]
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	let if_block0 = /*invalid*/ ctx[5] && create_if_block_1$2(ctx);
    	let if_block1 = !/*invalid*/ ctx[5] && /*warn*/ ctx[7] && create_if_block$9(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    			set_attributes(div, div_data);
    			toggle_class(div, "bx--list-box", true);
    			toggle_class(div, "bx--list-box--sm", /*size*/ ctx[0] === 'sm');
    			toggle_class(div, "bx--list-box--xl", /*size*/ ctx[0] === 'xl');
    			toggle_class(div, "bx--list-box--inline", /*type*/ ctx[1] === 'inline');
    			toggle_class(div, "bx--list-box--disabled", /*disabled*/ ctx[4]);
    			toggle_class(div, "bx--list-box--expanded", /*open*/ ctx[2]);
    			toggle_class(div, "bx--list-box--light", /*light*/ ctx[3]);
    			toggle_class(div, "bx--list-box--warning", !/*invalid*/ ctx[5] && /*warn*/ ctx[7]);
    			add_location(div, file$f, 35, 0, 769);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			insert_dev(target, t0, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "keydown", /*keydown_handler*/ ctx[12], false, false, false, false),
    					listen_dev(div, "keydown", keydown_handler_1, false, false, false, false),
    					listen_dev(div, "click", prevent_default(/*click_handler*/ ctx[13]), false, true, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1024)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[10],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[10])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[10], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				{ role: "listbox" },
    				{ tabindex: "-1" },
    				(!current || dirty & /*invalid*/ 32 && div_data_invalid_value !== (div_data_invalid_value = /*invalid*/ ctx[5] || undefined)) && { "data-invalid": div_data_invalid_value },
    				dirty & /*$$restProps*/ 512 && /*$$restProps*/ ctx[9]
    			]));

    			toggle_class(div, "bx--list-box", true);
    			toggle_class(div, "bx--list-box--sm", /*size*/ ctx[0] === 'sm');
    			toggle_class(div, "bx--list-box--xl", /*size*/ ctx[0] === 'xl');
    			toggle_class(div, "bx--list-box--inline", /*type*/ ctx[1] === 'inline');
    			toggle_class(div, "bx--list-box--disabled", /*disabled*/ ctx[4]);
    			toggle_class(div, "bx--list-box--expanded", /*open*/ ctx[2]);
    			toggle_class(div, "bx--list-box--light", /*light*/ ctx[3]);
    			toggle_class(div, "bx--list-box--warning", !/*invalid*/ ctx[5] && /*warn*/ ctx[7]);

    			if (/*invalid*/ ctx[5]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$2(ctx);
    					if_block0.c();
    					if_block0.m(t1.parentNode, t1);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (!/*invalid*/ ctx[5] && /*warn*/ ctx[7]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$9(ctx);
    					if_block1.c();
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const keydown_handler_1 = e => {
    	if (e.key === 'Escape') {
    		e.stopPropagation();
    	}
    };

    function instance$g($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"size","type","open","light","disabled","invalid","invalidText","warn","warnText"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ListBox', slots, ['default']);
    	let { size = undefined } = $$props;
    	let { type = "default" } = $$props;
    	let { open = false } = $$props;
    	let { light = false } = $$props;
    	let { disabled = false } = $$props;
    	let { invalid = false } = $$props;
    	let { invalidText = "" } = $$props;
    	let { warn = false } = $$props;
    	let { warnText = "" } = $$props;

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(9, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('size' in $$new_props) $$invalidate(0, size = $$new_props.size);
    		if ('type' in $$new_props) $$invalidate(1, type = $$new_props.type);
    		if ('open' in $$new_props) $$invalidate(2, open = $$new_props.open);
    		if ('light' in $$new_props) $$invalidate(3, light = $$new_props.light);
    		if ('disabled' in $$new_props) $$invalidate(4, disabled = $$new_props.disabled);
    		if ('invalid' in $$new_props) $$invalidate(5, invalid = $$new_props.invalid);
    		if ('invalidText' in $$new_props) $$invalidate(6, invalidText = $$new_props.invalidText);
    		if ('warn' in $$new_props) $$invalidate(7, warn = $$new_props.warn);
    		if ('warnText' in $$new_props) $$invalidate(8, warnText = $$new_props.warnText);
    		if ('$$scope' in $$new_props) $$invalidate(10, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		size,
    		type,
    		open,
    		light,
    		disabled,
    		invalid,
    		invalidText,
    		warn,
    		warnText
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('size' in $$props) $$invalidate(0, size = $$new_props.size);
    		if ('type' in $$props) $$invalidate(1, type = $$new_props.type);
    		if ('open' in $$props) $$invalidate(2, open = $$new_props.open);
    		if ('light' in $$props) $$invalidate(3, light = $$new_props.light);
    		if ('disabled' in $$props) $$invalidate(4, disabled = $$new_props.disabled);
    		if ('invalid' in $$props) $$invalidate(5, invalid = $$new_props.invalid);
    		if ('invalidText' in $$props) $$invalidate(6, invalidText = $$new_props.invalidText);
    		if ('warn' in $$props) $$invalidate(7, warn = $$new_props.warn);
    		if ('warnText' in $$props) $$invalidate(8, warnText = $$new_props.warnText);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		size,
    		type,
    		open,
    		light,
    		disabled,
    		invalid,
    		invalidText,
    		warn,
    		warnText,
    		$$restProps,
    		$$scope,
    		slots,
    		keydown_handler,
    		click_handler
    	];
    }

    class ListBox extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {
    			size: 0,
    			type: 1,
    			open: 2,
    			light: 3,
    			disabled: 4,
    			invalid: 5,
    			invalidText: 6,
    			warn: 7,
    			warnText: 8
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ListBox",
    			options,
    			id: create_fragment$g.name
    		});
    	}

    	get size() {
    		throw new Error("<ListBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<ListBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<ListBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<ListBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get open() {
    		throw new Error("<ListBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set open(value) {
    		throw new Error("<ListBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get light() {
    		throw new Error("<ListBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set light(value) {
    		throw new Error("<ListBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<ListBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<ListBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get invalid() {
    		throw new Error("<ListBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set invalid(value) {
    		throw new Error("<ListBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get invalidText() {
    		throw new Error("<ListBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set invalidText(value) {
    		throw new Error("<ListBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get warn() {
    		throw new Error("<ListBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set warn(value) {
    		throw new Error("<ListBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get warnText() {
    		throw new Error("<ListBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set warnText(value) {
    		throw new Error("<ListBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var ListBox$1 = ListBox;

    /* node_modules\carbon-components-svelte\src\ListBox\ListBoxMenu.svelte generated by Svelte v3.57.0 */

    const file$e = "node_modules\\carbon-components-svelte\\src\\ListBox\\ListBoxMenu.svelte";

    function create_fragment$f(ctx) {
    	let div;
    	let div_id_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	let div_levels = [
    		{ role: "listbox" },
    		{
    			id: div_id_value = "menu-" + /*id*/ ctx[1]
    		},
    		/*$$restProps*/ ctx[2]
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			toggle_class(div, "bx--list-box__menu", true);
    			add_location(div, file$e, 8, 0, 194);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[6](div);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "scroll", /*scroll_handler*/ ctx[5], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				{ role: "listbox" },
    				(!current || dirty & /*id*/ 2 && div_id_value !== (div_id_value = "menu-" + /*id*/ ctx[1])) && { id: div_id_value },
    				dirty & /*$$restProps*/ 4 && /*$$restProps*/ ctx[2]
    			]));

    			toggle_class(div, "bx--list-box__menu", true);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*div_binding*/ ctx[6](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	const omit_props_names = ["id","ref"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ListBoxMenu', slots, ['default']);
    	let { id = "ccs-" + Math.random().toString(36) } = $$props;
    	let { ref = null } = $$props;

    	function scroll_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			ref = $$value;
    			$$invalidate(0, ref);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(2, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('id' in $$new_props) $$invalidate(1, id = $$new_props.id);
    		if ('ref' in $$new_props) $$invalidate(0, ref = $$new_props.ref);
    		if ('$$scope' in $$new_props) $$invalidate(3, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ id, ref });

    	$$self.$inject_state = $$new_props => {
    		if ('id' in $$props) $$invalidate(1, id = $$new_props.id);
    		if ('ref' in $$props) $$invalidate(0, ref = $$new_props.ref);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [ref, id, $$restProps, $$scope, slots, scroll_handler, div_binding];
    }

    class ListBoxMenu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, { id: 1, ref: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ListBoxMenu",
    			options,
    			id: create_fragment$f.name
    		});
    	}

    	get id() {
    		throw new Error("<ListBoxMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<ListBoxMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ref() {
    		throw new Error("<ListBoxMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<ListBoxMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var ListBoxMenu$1 = ListBoxMenu;

    /* node_modules\carbon-components-svelte\src\icons\ChevronDown.svelte generated by Svelte v3.57.0 */

    const file$d = "node_modules\\carbon-components-svelte\\src\\icons\\ChevronDown.svelte";

    // (24:2) {#if title}
    function create_if_block$8(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[1]);
    			add_location(title_1, file$d, 23, 13, 549);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 2) set_data_dev(t, /*title*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(24:2) {#if title}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let svg;
    	let path;
    	let if_block = /*title*/ ctx[1] && create_if_block$8(ctx);

    	let svg_levels = [
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 32 32" },
    		{ fill: "currentColor" },
    		{ preserveAspectRatio: "xMidYMid meet" },
    		{ width: /*size*/ ctx[0] },
    		{ height: /*size*/ ctx[0] },
    		/*attributes*/ ctx[2],
    		/*$$restProps*/ ctx[3]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			if (if_block) if_block.c();
    			path = svg_element("path");
    			attr_dev(path, "d", "M16 22L6 12 7.4 10.6 16 19.2 24.6 10.6 26 12z");
    			add_location(path, file$d, 24, 2, 579);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$d, 13, 0, 338);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			if (if_block) if_block.m(svg, null);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*title*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$8(ctx);
    					if_block.c();
    					if_block.m(svg, path);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 32 32" },
    				{ fill: "currentColor" },
    				{ preserveAspectRatio: "xMidYMid meet" },
    				dirty & /*size*/ 1 && { width: /*size*/ ctx[0] },
    				dirty & /*size*/ 1 && { height: /*size*/ ctx[0] },
    				dirty & /*attributes*/ 4 && /*attributes*/ ctx[2],
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let labelled;
    	let attributes;
    	const omit_props_names = ["size","title"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ChevronDown', slots, []);
    	let { size = 16 } = $$props;
    	let { title = undefined } = $$props;

    	$$self.$$set = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('size' in $$new_props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$new_props) $$invalidate(1, title = $$new_props.title);
    	};

    	$$self.$capture_state = () => ({ size, title, labelled, attributes });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), $$new_props));
    		if ('size' in $$props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$props) $$invalidate(1, title = $$new_props.title);
    		if ('labelled' in $$props) $$invalidate(4, labelled = $$new_props.labelled);
    		if ('attributes' in $$props) $$invalidate(2, attributes = $$new_props.attributes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(4, labelled = $$props["aria-label"] || $$props["aria-labelledby"] || title);

    		$$invalidate(2, attributes = {
    			"aria-hidden": labelled ? undefined : true,
    			role: labelled ? "img" : undefined,
    			focusable: Number($$props["tabindex"]) === 0 ? true : undefined
    		});
    	};

    	$$props = exclude_internal_props($$props);
    	return [size, title, attributes, $$restProps, labelled];
    }

    class ChevronDown extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { size: 0, title: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ChevronDown",
    			options,
    			id: create_fragment$e.name
    		});
    	}

    	get size() {
    		throw new Error("<ChevronDown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<ChevronDown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<ChevronDown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<ChevronDown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var ChevronDown$1 = ChevronDown;

    /* node_modules\carbon-components-svelte\src\ListBox\ListBoxMenuIcon.svelte generated by Svelte v3.57.0 */
    const file$c = "node_modules\\carbon-components-svelte\\src\\ListBox\\ListBoxMenuIcon.svelte";

    function create_fragment$d(ctx) {
    	let div;
    	let chevrondown;
    	let current;
    	let mounted;
    	let dispose;

    	chevrondown = new ChevronDown$1({
    			props: {
    				"aria-label": /*description*/ ctx[1],
    				title: /*description*/ ctx[1]
    			},
    			$$inline: true
    		});

    	let div_levels = [/*$$restProps*/ ctx[2]];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(chevrondown.$$.fragment);
    			set_attributes(div, div_data);
    			toggle_class(div, "bx--list-box__menu-icon", true);
    			toggle_class(div, "bx--list-box__menu-icon--open", /*open*/ ctx[0]);
    			add_location(div, file$c, 29, 0, 799);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(chevrondown, div, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", prevent_default(/*click_handler*/ ctx[6]), false, true, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const chevrondown_changes = {};
    			if (dirty & /*description*/ 2) chevrondown_changes["aria-label"] = /*description*/ ctx[1];
    			if (dirty & /*description*/ 2) chevrondown_changes.title = /*description*/ ctx[1];
    			chevrondown.$set(chevrondown_changes);
    			set_attributes(div, div_data = get_spread_update(div_levels, [dirty & /*$$restProps*/ 4 && /*$$restProps*/ ctx[2]]));
    			toggle_class(div, "bx--list-box__menu-icon", true);
    			toggle_class(div, "bx--list-box__menu-icon--open", /*open*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(chevrondown.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(chevrondown.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(chevrondown);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let translationId;
    	let description;
    	const omit_props_names = ["open","translationIds","translateWithId"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ListBoxMenuIcon', slots, []);
    	let { open = false } = $$props;
    	const translationIds = { close: "close", open: "open" };
    	let { translateWithId = id => defaultTranslations[id] } = $$props;

    	const defaultTranslations = {
    		[translationIds.close]: "Close menu",
    		[translationIds.open]: "Open menu"
    	};

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(2, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('open' in $$new_props) $$invalidate(0, open = $$new_props.open);
    		if ('translateWithId' in $$new_props) $$invalidate(4, translateWithId = $$new_props.translateWithId);
    	};

    	$$self.$capture_state = () => ({
    		open,
    		translationIds,
    		translateWithId,
    		ChevronDown: ChevronDown$1,
    		defaultTranslations,
    		translationId,
    		description
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('open' in $$props) $$invalidate(0, open = $$new_props.open);
    		if ('translateWithId' in $$props) $$invalidate(4, translateWithId = $$new_props.translateWithId);
    		if ('translationId' in $$props) $$invalidate(5, translationId = $$new_props.translationId);
    		if ('description' in $$props) $$invalidate(1, description = $$new_props.description);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*open*/ 1) {
    			$$invalidate(5, translationId = open ? translationIds.close : translationIds.open);
    		}

    		if ($$self.$$.dirty & /*translateWithId, translationId*/ 48) {
    			$$invalidate(1, description = translateWithId?.(translationId) ?? defaultTranslations[translationId]);
    		}
    	};

    	return [
    		open,
    		description,
    		$$restProps,
    		translationIds,
    		translateWithId,
    		translationId,
    		click_handler
    	];
    }

    class ListBoxMenuIcon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {
    			open: 0,
    			translationIds: 3,
    			translateWithId: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ListBoxMenuIcon",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get open() {
    		throw new Error("<ListBoxMenuIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set open(value) {
    		throw new Error("<ListBoxMenuIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get translationIds() {
    		return this.$$.ctx[3];
    	}

    	set translationIds(value) {
    		throw new Error("<ListBoxMenuIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get translateWithId() {
    		throw new Error("<ListBoxMenuIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set translateWithId(value) {
    		throw new Error("<ListBoxMenuIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var ListBoxMenuIcon$1 = ListBoxMenuIcon;

    /* node_modules\carbon-components-svelte\src\ListBox\ListBoxMenuItem.svelte generated by Svelte v3.57.0 */

    const file$b = "node_modules\\carbon-components-svelte\\src\\ListBox\\ListBoxMenuItem.svelte";

    function create_fragment$c(ctx) {
    	let div1;
    	let div0;
    	let div1_disabled_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], null);

    	let div1_levels = [
    		{ role: "option" },
    		{ "aria-selected": /*active*/ ctx[0] },
    		{
    			disabled: div1_disabled_value = /*disabled*/ ctx[2] ? true : undefined
    		},
    		/*$$restProps*/ ctx[5]
    	];

    	let div1_data = {};

    	for (let i = 0; i < div1_levels.length; i += 1) {
    		div1_data = assign(div1_data, div1_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div0, "title", /*title*/ ctx[4]);
    			toggle_class(div0, "bx--list-box__menu-item__option", true);
    			add_location(div0, file$b, 32, 2, 897);
    			set_attributes(div1, div1_data);
    			toggle_class(div1, "bx--list-box__menu-item", true);
    			toggle_class(div1, "bx--list-box__menu-item--active", /*active*/ ctx[0]);
    			toggle_class(div1, "bx--list-box__menu-item--highlighted", /*highlighted*/ ctx[1] || /*active*/ ctx[0]);
    			add_location(div1, file$b, 20, 0, 577);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			/*div0_binding*/ ctx[12](div0);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div1, "click", /*click_handler*/ ctx[9], false, false, false, false),
    					listen_dev(div1, "mouseenter", /*mouseenter_handler*/ ctx[10], false, false, false, false),
    					listen_dev(div1, "mouseleave", /*mouseleave_handler*/ ctx[11], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 128)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[7],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[7], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*title*/ 16) {
    				attr_dev(div0, "title", /*title*/ ctx[4]);
    			}

    			set_attributes(div1, div1_data = get_spread_update(div1_levels, [
    				{ role: "option" },
    				(!current || dirty & /*active*/ 1) && { "aria-selected": /*active*/ ctx[0] },
    				(!current || dirty & /*disabled*/ 4 && div1_disabled_value !== (div1_disabled_value = /*disabled*/ ctx[2] ? true : undefined)) && { disabled: div1_disabled_value },
    				dirty & /*$$restProps*/ 32 && /*$$restProps*/ ctx[5]
    			]));

    			toggle_class(div1, "bx--list-box__menu-item", true);
    			toggle_class(div1, "bx--list-box__menu-item--active", /*active*/ ctx[0]);
    			toggle_class(div1, "bx--list-box__menu-item--highlighted", /*highlighted*/ ctx[1] || /*active*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (default_slot) default_slot.d(detaching);
    			/*div0_binding*/ ctx[12](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let isTruncated;
    	let title;
    	const omit_props_names = ["active","highlighted","disabled"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ListBoxMenuItem', slots, ['default']);
    	let { active = false } = $$props;
    	let { highlighted = false } = $$props;
    	let { disabled = false } = $$props;
    	let ref = null;

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			ref = $$value;
    			$$invalidate(3, ref);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(5, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('active' in $$new_props) $$invalidate(0, active = $$new_props.active);
    		if ('highlighted' in $$new_props) $$invalidate(1, highlighted = $$new_props.highlighted);
    		if ('disabled' in $$new_props) $$invalidate(2, disabled = $$new_props.disabled);
    		if ('$$scope' in $$new_props) $$invalidate(7, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		active,
    		highlighted,
    		disabled,
    		ref,
    		isTruncated,
    		title
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('active' in $$props) $$invalidate(0, active = $$new_props.active);
    		if ('highlighted' in $$props) $$invalidate(1, highlighted = $$new_props.highlighted);
    		if ('disabled' in $$props) $$invalidate(2, disabled = $$new_props.disabled);
    		if ('ref' in $$props) $$invalidate(3, ref = $$new_props.ref);
    		if ('isTruncated' in $$props) $$invalidate(6, isTruncated = $$new_props.isTruncated);
    		if ('title' in $$props) $$invalidate(4, title = $$new_props.title);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*ref*/ 8) {
    			$$invalidate(6, isTruncated = ref?.offsetWidth < ref?.scrollWidth);
    		}

    		if ($$self.$$.dirty & /*isTruncated, ref*/ 72) {
    			$$invalidate(4, title = isTruncated ? ref?.innerText : undefined);
    		}

    		if ($$self.$$.dirty & /*highlighted, ref*/ 10) {
    			if (highlighted && ref && !ref.matches(":hover")) {
    				// Scroll highlighted item into view if using keyboard navigation
    				ref.scrollIntoView({ block: "nearest" });
    			}
    		}
    	};

    	return [
    		active,
    		highlighted,
    		disabled,
    		ref,
    		title,
    		$$restProps,
    		isTruncated,
    		$$scope,
    		slots,
    		click_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		div0_binding
    	];
    }

    class ListBoxMenuItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { active: 0, highlighted: 1, disabled: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ListBoxMenuItem",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get active() {
    		throw new Error("<ListBoxMenuItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<ListBoxMenuItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get highlighted() {
    		throw new Error("<ListBoxMenuItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set highlighted(value) {
    		throw new Error("<ListBoxMenuItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<ListBoxMenuItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<ListBoxMenuItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var ListBoxMenuItem$1 = ListBoxMenuItem;

    /* node_modules\carbon-components-svelte\src\icons\Close.svelte generated by Svelte v3.57.0 */

    const file$a = "node_modules\\carbon-components-svelte\\src\\icons\\Close.svelte";

    // (24:2) {#if title}
    function create_if_block$7(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[1]);
    			add_location(title_1, file$a, 23, 13, 549);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 2) set_data_dev(t, /*title*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(24:2) {#if title}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let svg;
    	let path;
    	let if_block = /*title*/ ctx[1] && create_if_block$7(ctx);

    	let svg_levels = [
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 32 32" },
    		{ fill: "currentColor" },
    		{ preserveAspectRatio: "xMidYMid meet" },
    		{ width: /*size*/ ctx[0] },
    		{ height: /*size*/ ctx[0] },
    		/*attributes*/ ctx[2],
    		/*$$restProps*/ ctx[3]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			if (if_block) if_block.c();
    			path = svg_element("path");
    			attr_dev(path, "d", "M24 9.4L22.6 8 16 14.6 9.4 8 8 9.4 14.6 16 8 22.6 9.4 24 16 17.4 22.6 24 24 22.6 17.4 16 24 9.4z");
    			add_location(path, file$a, 24, 2, 579);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$a, 13, 0, 338);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			if (if_block) if_block.m(svg, null);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*title*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$7(ctx);
    					if_block.c();
    					if_block.m(svg, path);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 32 32" },
    				{ fill: "currentColor" },
    				{ preserveAspectRatio: "xMidYMid meet" },
    				dirty & /*size*/ 1 && { width: /*size*/ ctx[0] },
    				dirty & /*size*/ 1 && { height: /*size*/ ctx[0] },
    				dirty & /*attributes*/ 4 && /*attributes*/ ctx[2],
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let labelled;
    	let attributes;
    	const omit_props_names = ["size","title"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Close', slots, []);
    	let { size = 16 } = $$props;
    	let { title = undefined } = $$props;

    	$$self.$$set = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('size' in $$new_props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$new_props) $$invalidate(1, title = $$new_props.title);
    	};

    	$$self.$capture_state = () => ({ size, title, labelled, attributes });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), $$new_props));
    		if ('size' in $$props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$props) $$invalidate(1, title = $$new_props.title);
    		if ('labelled' in $$props) $$invalidate(4, labelled = $$new_props.labelled);
    		if ('attributes' in $$props) $$invalidate(2, attributes = $$new_props.attributes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(4, labelled = $$props["aria-label"] || $$props["aria-labelledby"] || title);

    		$$invalidate(2, attributes = {
    			"aria-hidden": labelled ? undefined : true,
    			role: labelled ? "img" : undefined,
    			focusable: Number($$props["tabindex"]) === 0 ? true : undefined
    		});
    	};

    	$$props = exclude_internal_props($$props);
    	return [size, title, attributes, $$restProps, labelled];
    }

    class Close extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { size: 0, title: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Close",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get size() {
    		throw new Error("<Close>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Close>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<Close>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Close>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Close$1 = Close;

    /* node_modules\carbon-components-svelte\src\Dropdown\Dropdown.svelte generated by Svelte v3.57.0 */

    const file$9 = "node_modules\\carbon-components-svelte\\src\\Dropdown\\Dropdown.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[39] = list[i];
    	child_ctx[41] = i;
    	return child_ctx;
    }

    const get_default_slot_changes = dirty => ({
    	item: dirty[0] & /*items*/ 8,
    	index: dirty[0] & /*items*/ 8
    });

    const get_default_slot_context = ctx => ({
    	item: /*item*/ ctx[39],
    	index: /*i*/ ctx[41]
    });

    // (184:2) {#if titleText}
    function create_if_block_5(ctx) {
    	let label_1;
    	let t;

    	const block = {
    		c: function create() {
    			label_1 = element("label");
    			t = text(/*titleText*/ ctx[10]);
    			attr_dev(label_1, "for", /*id*/ ctx[19]);
    			toggle_class(label_1, "bx--label", true);
    			toggle_class(label_1, "bx--label--disabled", /*disabled*/ ctx[9]);
    			toggle_class(label_1, "bx--visually-hidden", /*hideLabel*/ ctx[17]);
    			add_location(label_1, file$9, 184, 4, 4378);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label_1, anchor);
    			append_dev(label_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*titleText*/ 1024) set_data_dev(t, /*titleText*/ ctx[10]);

    			if (dirty[0] & /*id*/ 524288) {
    				attr_dev(label_1, "for", /*id*/ ctx[19]);
    			}

    			if (dirty[0] & /*disabled*/ 512) {
    				toggle_class(label_1, "bx--label--disabled", /*disabled*/ ctx[9]);
    			}

    			if (dirty[0] & /*hideLabel*/ 131072) {
    				toggle_class(label_1, "bx--visually-hidden", /*hideLabel*/ ctx[17]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(184:2) {#if titleText}",
    		ctx
    	});

    	return block;
    }

    // (222:4) {#if invalid}
    function create_if_block_4(ctx) {
    	let warningfilled;
    	let current;

    	warningfilled = new WarningFilled$1({
    			props: { class: "bx--list-box__invalid-icon" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(warningfilled.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(warningfilled, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(warningfilled.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(warningfilled.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(warningfilled, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(222:4) {#if invalid}",
    		ctx
    	});

    	return block;
    }

    // (225:4) {#if !invalid && warn}
    function create_if_block_3(ctx) {
    	let warningaltfilled;
    	let current;

    	warningaltfilled = new WarningAltFilled$1({
    			props: {
    				class: "bx--list-box__invalid-icon bx--list-box__invalid-icon--warning"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(warningaltfilled.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(warningaltfilled, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(warningaltfilled.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(warningaltfilled.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(warningaltfilled, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(225:4) {#if !invalid && warn}",
    		ctx
    	});

    	return block;
    }

    // (287:54) {:else}
    function create_else_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*label*/ ctx[16]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*label*/ 65536) set_data_dev(t, /*label*/ ctx[16]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(287:54) {:else}",
    		ctx
    	});

    	return block;
    }

    // (287:8) {#if selectedItem}
    function create_if_block_2(ctx) {
    	let t_value = /*itemToString*/ ctx[4](/*selectedItem*/ ctx[22]) + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*itemToString, selectedItem*/ 4194320 && t_value !== (t_value = /*itemToString*/ ctx[4](/*selectedItem*/ ctx[22]) + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(287:8) {#if selectedItem}",
    		ctx
    	});

    	return block;
    }

    // (299:4) {#if open}
    function create_if_block_1$1(ctx) {
    	let listboxmenu;
    	let current;

    	listboxmenu = new ListBoxMenu$1({
    			props: {
    				"aria-labelledby": /*id*/ ctx[19],
    				id: /*id*/ ctx[19],
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(listboxmenu.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(listboxmenu, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const listboxmenu_changes = {};
    			if (dirty[0] & /*id*/ 524288) listboxmenu_changes["aria-labelledby"] = /*id*/ ctx[19];
    			if (dirty[0] & /*id*/ 524288) listboxmenu_changes.id = /*id*/ ctx[19];

    			if (dirty[0] & /*items, selectedId, highlightedIndex, ref, itemToString*/ 2097181 | dirty[1] & /*$$scope*/ 64) {
    				listboxmenu_changes.$$scope = { dirty, ctx };
    			}

    			listboxmenu.$set(listboxmenu_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(listboxmenu.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(listboxmenu.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(listboxmenu, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(299:4) {#if open}",
    		ctx
    	});

    	return block;
    }

    // (321:44)                
    function fallback_block$1(ctx) {
    	let t_value = /*itemToString*/ ctx[4](/*item*/ ctx[39]) + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*itemToString, items*/ 24 && t_value !== (t_value = /*itemToString*/ ctx[4](/*item*/ ctx[39]) + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$1.name,
    		type: "fallback",
    		source: "(321:44)                ",
    		ctx
    	});

    	return block;
    }

    // (302:10) <ListBoxMenuItem             id="{item.id}"             active="{selectedId === item.id}"             highlighted="{highlightedIndex === i}"             disabled="{item.disabled}"             on:click="{(e) => {               if (item.disabled) {                 e.stopPropagation();                 return;               }               selectedId = item.id;               dispatchSelect();               ref.focus();             }}"             on:mouseenter="{() => {               if (item.disabled) return;               highlightedIndex = i;             }}"           >
    function create_default_slot_2$1(ctx) {
    	let t;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[29].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[37], get_default_slot_context);
    	const default_slot_or_fallback = default_slot || fallback_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(target, anchor);
    			}

    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*items*/ 8 | dirty[1] & /*$$scope*/ 64)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[37],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[37])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[37], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty[0] & /*itemToString, items*/ 24)) {
    					default_slot_or_fallback.p(ctx, !current ? [-1, -1] : dirty);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(302:10) <ListBoxMenuItem             id=\\\"{item.id}\\\"             active=\\\"{selectedId === item.id}\\\"             highlighted=\\\"{highlightedIndex === i}\\\"             disabled=\\\"{item.disabled}\\\"             on:click=\\\"{(e) => {               if (item.disabled) {                 e.stopPropagation();                 return;               }               selectedId = item.id;               dispatchSelect();               ref.focus();             }}\\\"             on:mouseenter=\\\"{() => {               if (item.disabled) return;               highlightedIndex = i;             }}\\\"           >",
    		ctx
    	});

    	return block;
    }

    // (301:8) {#each items as item, i (item.id)}
    function create_each_block(key_1, ctx) {
    	let first;
    	let listboxmenuitem;
    	let current;

    	function click_handler_1(...args) {
    		return /*click_handler_1*/ ctx[34](/*item*/ ctx[39], ...args);
    	}

    	function mouseenter_handler() {
    		return /*mouseenter_handler*/ ctx[35](/*item*/ ctx[39], /*i*/ ctx[41]);
    	}

    	listboxmenuitem = new ListBoxMenuItem$1({
    			props: {
    				id: /*item*/ ctx[39].id,
    				active: /*selectedId*/ ctx[0] === /*item*/ ctx[39].id,
    				highlighted: /*highlightedIndex*/ ctx[21] === /*i*/ ctx[41],
    				disabled: /*item*/ ctx[39].disabled,
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	listboxmenuitem.$on("click", click_handler_1);
    	listboxmenuitem.$on("mouseenter", mouseenter_handler);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(listboxmenuitem.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(listboxmenuitem, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const listboxmenuitem_changes = {};
    			if (dirty[0] & /*items*/ 8) listboxmenuitem_changes.id = /*item*/ ctx[39].id;
    			if (dirty[0] & /*selectedId, items*/ 9) listboxmenuitem_changes.active = /*selectedId*/ ctx[0] === /*item*/ ctx[39].id;
    			if (dirty[0] & /*highlightedIndex, items*/ 2097160) listboxmenuitem_changes.highlighted = /*highlightedIndex*/ ctx[21] === /*i*/ ctx[41];
    			if (dirty[0] & /*items*/ 8) listboxmenuitem_changes.disabled = /*item*/ ctx[39].disabled;

    			if (dirty[0] & /*itemToString, items*/ 24 | dirty[1] & /*$$scope*/ 64) {
    				listboxmenuitem_changes.$$scope = { dirty, ctx };
    			}

    			listboxmenuitem.$set(listboxmenuitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(listboxmenuitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(listboxmenuitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(listboxmenuitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(301:8) {#each items as item, i (item.id)}",
    		ctx
    	});

    	return block;
    }

    // (300:6) <ListBoxMenu aria-labelledby="{id}" id="{id}">
    function create_default_slot_1$1(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let current;
    	let each_value = /*items*/ ctx[3];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*item*/ ctx[39].id;
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*items, selectedId, highlightedIndex, dispatchSelect, ref, itemToString*/ 35651613 | dirty[1] & /*$$scope*/ 64) {
    				each_value = /*items*/ ctx[3];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block, each_1_anchor, get_each_context);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(300:6) <ListBoxMenu aria-labelledby=\\\"{id}\\\" id=\\\"{id}\\\">",
    		ctx
    	});

    	return block;
    }

    // (194:2) <ListBox     role="{undefined}"     type="{type}"     size="{size}"     name="{name}"     aria-label="{$$props['aria-label']}"     class="bx--dropdown        {direction === 'top' && 'bx--list-box--up'}        {invalid && 'bx--dropdown--invalid'}        {!invalid && warn && 'bx--dropdown--warning'}        {open && 'bx--dropdown--open'}       {size === 'sm' && 'bx--dropdown--sm'}       {size === 'xl' && 'bx--dropdown--xl'}       {inline && 'bx--dropdown--inline'}       {disabled && 'bx--dropdown--disabled'}       {light && 'bx--dropdown--light'}"     on:click="{({ target }) => {       if (disabled) return;       open = ref.contains(target) ? !open : false;     }}"     disabled="{disabled}"     open="{open}"     invalid="{invalid}"     invalidText="{invalidText}"     light="{light}"     warn="{warn}"     warnText="{warnText}"   >
    function create_default_slot$1(ctx) {
    	let t0;
    	let t1;
    	let button;
    	let span;
    	let t2;
    	let listboxmenuicon;
    	let t3;
    	let if_block3_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*invalid*/ ctx[11] && create_if_block_4(ctx);
    	let if_block1 = !/*invalid*/ ctx[11] && /*warn*/ ctx[13] && create_if_block_3(ctx);

    	function select_block_type(ctx, dirty) {
    		if (/*selectedItem*/ ctx[22]) return create_if_block_2;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block2 = current_block_type(ctx);

    	listboxmenuicon = new ListBoxMenuIcon$1({
    			props: {
    				translateWithId: /*translateWithId*/ ctx[18],
    				open: /*open*/ ctx[1]
    			},
    			$$inline: true
    		});

    	listboxmenuicon.$on("click", /*click_handler*/ ctx[30]);
    	let if_block3 = /*open*/ ctx[1] && create_if_block_1$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			button = element("button");
    			span = element("span");
    			if_block2.c();
    			t2 = space();
    			create_component(listboxmenuicon.$$.fragment);
    			t3 = space();
    			if (if_block3) if_block3.c();
    			if_block3_anchor = empty();
    			toggle_class(span, "bx--list-box__label", true);
    			add_location(span, file$9, 285, 6, 7122);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "tabindex", "0");
    			attr_dev(button, "aria-expanded", /*open*/ ctx[1]);
    			button.disabled = /*disabled*/ ctx[9];
    			attr_dev(button, "translatewithid", /*translateWithId*/ ctx[18]);
    			attr_dev(button, "id", /*id*/ ctx[19]);
    			toggle_class(button, "bx--list-box__field", true);
    			add_location(button, file$9, 229, 4, 5650);
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, button, anchor);
    			append_dev(button, span);
    			if_block2.m(span, null);
    			append_dev(button, t2);
    			mount_component(listboxmenuicon, button, null);
    			/*button_binding*/ ctx[31](button);
    			insert_dev(target, t3, anchor);
    			if (if_block3) if_block3.m(target, anchor);
    			insert_dev(target, if_block3_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "keydown", /*keydown_handler*/ ctx[32], false, false, false, false),
    					listen_dev(button, "keyup", /*keyup_handler*/ ctx[33], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*invalid*/ ctx[11]) {
    				if (if_block0) {
    					if (dirty[0] & /*invalid*/ 2048) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_4(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (!/*invalid*/ ctx[11] && /*warn*/ ctx[13]) {
    				if (if_block1) {
    					if (dirty[0] & /*invalid, warn*/ 10240) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_3(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(t1.parentNode, t1);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block2) {
    				if_block2.p(ctx, dirty);
    			} else {
    				if_block2.d(1);
    				if_block2 = current_block_type(ctx);

    				if (if_block2) {
    					if_block2.c();
    					if_block2.m(span, null);
    				}
    			}

    			const listboxmenuicon_changes = {};
    			if (dirty[0] & /*translateWithId*/ 262144) listboxmenuicon_changes.translateWithId = /*translateWithId*/ ctx[18];
    			if (dirty[0] & /*open*/ 2) listboxmenuicon_changes.open = /*open*/ ctx[1];
    			listboxmenuicon.$set(listboxmenuicon_changes);

    			if (!current || dirty[0] & /*open*/ 2) {
    				attr_dev(button, "aria-expanded", /*open*/ ctx[1]);
    			}

    			if (!current || dirty[0] & /*disabled*/ 512) {
    				prop_dev(button, "disabled", /*disabled*/ ctx[9]);
    			}

    			if (!current || dirty[0] & /*translateWithId*/ 262144) {
    				attr_dev(button, "translatewithid", /*translateWithId*/ ctx[18]);
    			}

    			if (!current || dirty[0] & /*id*/ 524288) {
    				attr_dev(button, "id", /*id*/ ctx[19]);
    			}

    			if (/*open*/ ctx[1]) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);

    					if (dirty[0] & /*open*/ 2) {
    						transition_in(if_block3, 1);
    					}
    				} else {
    					if_block3 = create_if_block_1$1(ctx);
    					if_block3.c();
    					transition_in(if_block3, 1);
    					if_block3.m(if_block3_anchor.parentNode, if_block3_anchor);
    				}
    			} else if (if_block3) {
    				group_outros();

    				transition_out(if_block3, 1, 1, () => {
    					if_block3 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(listboxmenuicon.$$.fragment, local);
    			transition_in(if_block3);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(listboxmenuicon.$$.fragment, local);
    			transition_out(if_block3);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(button);
    			if_block2.d();
    			destroy_component(listboxmenuicon);
    			/*button_binding*/ ctx[31](null);
    			if (detaching) detach_dev(t3);
    			if (if_block3) if_block3.d(detaching);
    			if (detaching) detach_dev(if_block3_anchor);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(194:2) <ListBox     role=\\\"{undefined}\\\"     type=\\\"{type}\\\"     size=\\\"{size}\\\"     name=\\\"{name}\\\"     aria-label=\\\"{$$props['aria-label']}\\\"     class=\\\"bx--dropdown        {direction === 'top' && 'bx--list-box--up'}        {invalid && 'bx--dropdown--invalid'}        {!invalid && warn && 'bx--dropdown--warning'}        {open && 'bx--dropdown--open'}       {size === 'sm' && 'bx--dropdown--sm'}       {size === 'xl' && 'bx--dropdown--xl'}       {inline && 'bx--dropdown--inline'}       {disabled && 'bx--dropdown--disabled'}       {light && 'bx--dropdown--light'}\\\"     on:click=\\\"{({ target }) => {       if (disabled) return;       open = ref.contains(target) ? !open : false;     }}\\\"     disabled=\\\"{disabled}\\\"     open=\\\"{open}\\\"     invalid=\\\"{invalid}\\\"     invalidText=\\\"{invalidText}\\\"     light=\\\"{light}\\\"     warn=\\\"{warn}\\\"     warnText=\\\"{warnText}\\\"   >",
    		ctx
    	});

    	return block;
    }

    // (329:2) {#if !inline && !invalid && !warn && helperText}
    function create_if_block$6(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*helperText*/ ctx[15]);
    			toggle_class(div, "bx--form__helper-text", true);
    			toggle_class(div, "bx--form__helper-text--disabled", /*disabled*/ ctx[9]);
    			add_location(div, file$9, 329, 4, 8432);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*helperText*/ 32768) set_data_dev(t, /*helperText*/ ctx[15]);

    			if (dirty[0] & /*disabled*/ 512) {
    				toggle_class(div, "bx--form__helper-text--disabled", /*disabled*/ ctx[9]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(329:2) {#if !inline && !invalid && !warn && helperText}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let div;
    	let t0;
    	let listbox;
    	let t1;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*titleText*/ ctx[10] && create_if_block_5(ctx);

    	listbox = new ListBox$1({
    			props: {
    				role: undefined,
    				type: /*type*/ ctx[5],
    				size: /*size*/ ctx[7],
    				name: /*name*/ ctx[20],
    				"aria-label": /*$$props*/ ctx[28]['aria-label'],
    				class: "bx--dropdown \n      " + (/*direction*/ ctx[6] === 'top' && 'bx--list-box--up') + " \n      " + (/*invalid*/ ctx[11] && 'bx--dropdown--invalid') + " \n      " + (!/*invalid*/ ctx[11] && /*warn*/ ctx[13] && 'bx--dropdown--warning') + " \n      " + (/*open*/ ctx[1] && 'bx--dropdown--open') + "\n      " + (/*size*/ ctx[7] === 'sm' && 'bx--dropdown--sm') + "\n      " + (/*size*/ ctx[7] === 'xl' && 'bx--dropdown--xl') + "\n      " + (/*inline*/ ctx[23] && 'bx--dropdown--inline') + "\n      " + (/*disabled*/ ctx[9] && 'bx--dropdown--disabled') + "\n      " + (/*light*/ ctx[8] && 'bx--dropdown--light'),
    				disabled: /*disabled*/ ctx[9],
    				open: /*open*/ ctx[1],
    				invalid: /*invalid*/ ctx[11],
    				invalidText: /*invalidText*/ ctx[12],
    				light: /*light*/ ctx[8],
    				warn: /*warn*/ ctx[13],
    				warnText: /*warnText*/ ctx[14],
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	listbox.$on("click", /*click_handler_2*/ ctx[36]);
    	let if_block1 = !/*inline*/ ctx[23] && !/*invalid*/ ctx[11] && !/*warn*/ ctx[13] && /*helperText*/ ctx[15] && create_if_block$6(ctx);
    	let div_levels = [/*$$restProps*/ ctx[27]];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			create_component(listbox.$$.fragment);
    			t1 = space();
    			if (if_block1) if_block1.c();
    			set_attributes(div, div_data);
    			toggle_class(div, "bx--dropdown__wrapper", true);
    			toggle_class(div, "bx--list-box__wrapper", true);
    			toggle_class(div, "bx--dropdown__wrapper--inline", /*inline*/ ctx[23]);
    			toggle_class(div, "bx--list-box__wrapper--inline", /*inline*/ ctx[23]);
    			toggle_class(div, "bx--dropdown__wrapper--inline--invalid", /*inline*/ ctx[23] && /*invalid*/ ctx[11]);
    			add_location(div, file$9, 175, 0, 4085);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t0);
    			mount_component(listbox, div, null);
    			append_dev(div, t1);
    			if (if_block1) if_block1.m(div, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window, "click", /*pageClickHandler*/ ctx[26], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*titleText*/ ctx[10]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_5(ctx);
    					if_block0.c();
    					if_block0.m(div, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			const listbox_changes = {};
    			if (dirty[0] & /*type*/ 32) listbox_changes.type = /*type*/ ctx[5];
    			if (dirty[0] & /*size*/ 128) listbox_changes.size = /*size*/ ctx[7];
    			if (dirty[0] & /*name*/ 1048576) listbox_changes.name = /*name*/ ctx[20];
    			if (dirty[0] & /*$$props*/ 268435456) listbox_changes["aria-label"] = /*$$props*/ ctx[28]['aria-label'];
    			if (dirty[0] & /*direction, invalid, warn, open, size, inline, disabled, light*/ 8399810) listbox_changes.class = "bx--dropdown \n      " + (/*direction*/ ctx[6] === 'top' && 'bx--list-box--up') + " \n      " + (/*invalid*/ ctx[11] && 'bx--dropdown--invalid') + " \n      " + (!/*invalid*/ ctx[11] && /*warn*/ ctx[13] && 'bx--dropdown--warning') + " \n      " + (/*open*/ ctx[1] && 'bx--dropdown--open') + "\n      " + (/*size*/ ctx[7] === 'sm' && 'bx--dropdown--sm') + "\n      " + (/*size*/ ctx[7] === 'xl' && 'bx--dropdown--xl') + "\n      " + (/*inline*/ ctx[23] && 'bx--dropdown--inline') + "\n      " + (/*disabled*/ ctx[9] && 'bx--dropdown--disabled') + "\n      " + (/*light*/ ctx[8] && 'bx--dropdown--light');
    			if (dirty[0] & /*disabled*/ 512) listbox_changes.disabled = /*disabled*/ ctx[9];
    			if (dirty[0] & /*open*/ 2) listbox_changes.open = /*open*/ ctx[1];
    			if (dirty[0] & /*invalid*/ 2048) listbox_changes.invalid = /*invalid*/ ctx[11];
    			if (dirty[0] & /*invalidText*/ 4096) listbox_changes.invalidText = /*invalidText*/ ctx[12];
    			if (dirty[0] & /*light*/ 256) listbox_changes.light = /*light*/ ctx[8];
    			if (dirty[0] & /*warn*/ 8192) listbox_changes.warn = /*warn*/ ctx[13];
    			if (dirty[0] & /*warnText*/ 16384) listbox_changes.warnText = /*warnText*/ ctx[14];

    			if (dirty[0] & /*id, items, selectedId, highlightedIndex, ref, itemToString, open, disabled, translateWithId, selectedItem, label, invalid, warn*/ 7154207 | dirty[1] & /*$$scope*/ 64) {
    				listbox_changes.$$scope = { dirty, ctx };
    			}

    			listbox.$set(listbox_changes);

    			if (!/*inline*/ ctx[23] && !/*invalid*/ ctx[11] && !/*warn*/ ctx[13] && /*helperText*/ ctx[15]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$6(ctx);
    					if_block1.c();
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [dirty[0] & /*$$restProps*/ 134217728 && /*$$restProps*/ ctx[27]]));
    			toggle_class(div, "bx--dropdown__wrapper", true);
    			toggle_class(div, "bx--list-box__wrapper", true);
    			toggle_class(div, "bx--dropdown__wrapper--inline", /*inline*/ ctx[23]);
    			toggle_class(div, "bx--list-box__wrapper--inline", /*inline*/ ctx[23]);
    			toggle_class(div, "bx--dropdown__wrapper--inline--invalid", /*inline*/ ctx[23] && /*invalid*/ ctx[11]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(listbox.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(listbox.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			destroy_component(listbox);
    			if (if_block1) if_block1.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let inline;
    	let selectedItem;

    	const omit_props_names = [
    		"items","itemToString","selectedId","type","direction","size","open","light","disabled","titleText","invalid","invalidText","warn","warnText","helperText","label","hideLabel","translateWithId","id","name","ref"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Dropdown', slots, ['default']);
    	let { items = [] } = $$props;
    	let { itemToString = item => item.text || item.id } = $$props;
    	let { selectedId } = $$props;
    	let { type = "default" } = $$props;
    	let { direction = "bottom" } = $$props;
    	let { size = undefined } = $$props;
    	let { open = false } = $$props;
    	let { light = false } = $$props;
    	let { disabled = false } = $$props;
    	let { titleText = "" } = $$props;
    	let { invalid = false } = $$props;
    	let { invalidText = "" } = $$props;
    	let { warn = false } = $$props;
    	let { warnText = "" } = $$props;
    	let { helperText = "" } = $$props;
    	let { label = undefined } = $$props;
    	let { hideLabel = false } = $$props;
    	let { translateWithId = undefined } = $$props;
    	let { id = "ccs-" + Math.random().toString(36) } = $$props;
    	let { name = undefined } = $$props;
    	let { ref = null } = $$props;
    	const dispatch = createEventDispatcher();
    	let highlightedIndex = -1;

    	function change(dir) {
    		let index = highlightedIndex + dir;
    		if (items.length === 0) return;

    		if (index < 0) {
    			index = items.length - 1;
    		} else if (index >= items.length) {
    			index = 0;
    		}

    		let disabled = items[index].disabled;

    		while (disabled) {
    			index = index + dir;

    			if (index < 0) {
    				index = items.length - 1;
    			} else if (index >= items.length) {
    				index = 0;
    			}

    			disabled = items[index].disabled;
    		}

    		$$invalidate(21, highlightedIndex = index);
    	}

    	const dispatchSelect = () => {
    		dispatch("select", {
    			selectedId,
    			selectedItem: items.find(item => item.id === selectedId)
    		});
    	};

    	const pageClickHandler = ({ target }) => {
    		if (open && ref && !ref.contains(target)) {
    			$$invalidate(1, open = false);
    		}
    	};

    	onMount(() => {
    		if (parent) {
    			parent.addEventListener("click", pageClickHandler);
    		}

    		return () => {
    			if (parent) {
    				parent.removeEventListener("click", pageClickHandler);
    			}
    		};
    	});

    	$$self.$$.on_mount.push(function () {
    		if (selectedId === undefined && !('selectedId' in $$props || $$self.$$.bound[$$self.$$.props['selectedId']])) {
    			console.warn("<Dropdown> was created without expected prop 'selectedId'");
    		}
    	});

    	const click_handler = e => {
    		e.stopPropagation();
    		if (disabled) return;
    		$$invalidate(1, open = !open);
    	};

    	function button_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			ref = $$value;
    			$$invalidate(2, ref);
    		});
    	}

    	const keydown_handler = e => {
    		const { key } = e;

    		if (['Enter', 'ArrowDown', 'ArrowUp'].includes(key)) {
    			e.preventDefault();
    		}

    		if (key === 'Enter') {
    			$$invalidate(1, open = !open);

    			if (highlightedIndex > -1 && items[highlightedIndex].id !== selectedId) {
    				$$invalidate(0, selectedId = items[highlightedIndex].id);
    				dispatchSelect();
    				$$invalidate(1, open = false);
    			}
    		} else if (key === 'Tab') {
    			$$invalidate(1, open = false);
    			ref.blur();
    		} else if (key === 'ArrowDown') {
    			if (!open) $$invalidate(1, open = true);
    			change(1);
    		} else if (key === 'ArrowUp') {
    			if (!open) $$invalidate(1, open = true);
    			change(-1);
    		} else if (key === 'Escape') {
    			$$invalidate(1, open = false);
    		}
    	};

    	const keyup_handler = e => {
    		const { key } = e;

    		if ([' '].includes(key)) {
    			e.preventDefault();
    		} else {
    			return;
    		}

    		$$invalidate(1, open = !open);

    		if (highlightedIndex > -1 && items[highlightedIndex].id !== selectedId) {
    			$$invalidate(0, selectedId = items[highlightedIndex].id);
    			dispatchSelect();
    			$$invalidate(1, open = false);
    		}
    	};

    	const click_handler_1 = (item, e) => {
    		if (item.disabled) {
    			e.stopPropagation();
    			return;
    		}

    		$$invalidate(0, selectedId = item.id);
    		dispatchSelect();
    		ref.focus();
    	};

    	const mouseenter_handler = (item, i) => {
    		if (item.disabled) return;
    		$$invalidate(21, highlightedIndex = i);
    	};

    	const click_handler_2 = ({ target }) => {
    		if (disabled) return;
    		$$invalidate(1, open = ref.contains(target) ? !open : false);
    	};

    	$$self.$$set = $$new_props => {
    		$$invalidate(28, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(27, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('items' in $$new_props) $$invalidate(3, items = $$new_props.items);
    		if ('itemToString' in $$new_props) $$invalidate(4, itemToString = $$new_props.itemToString);
    		if ('selectedId' in $$new_props) $$invalidate(0, selectedId = $$new_props.selectedId);
    		if ('type' in $$new_props) $$invalidate(5, type = $$new_props.type);
    		if ('direction' in $$new_props) $$invalidate(6, direction = $$new_props.direction);
    		if ('size' in $$new_props) $$invalidate(7, size = $$new_props.size);
    		if ('open' in $$new_props) $$invalidate(1, open = $$new_props.open);
    		if ('light' in $$new_props) $$invalidate(8, light = $$new_props.light);
    		if ('disabled' in $$new_props) $$invalidate(9, disabled = $$new_props.disabled);
    		if ('titleText' in $$new_props) $$invalidate(10, titleText = $$new_props.titleText);
    		if ('invalid' in $$new_props) $$invalidate(11, invalid = $$new_props.invalid);
    		if ('invalidText' in $$new_props) $$invalidate(12, invalidText = $$new_props.invalidText);
    		if ('warn' in $$new_props) $$invalidate(13, warn = $$new_props.warn);
    		if ('warnText' in $$new_props) $$invalidate(14, warnText = $$new_props.warnText);
    		if ('helperText' in $$new_props) $$invalidate(15, helperText = $$new_props.helperText);
    		if ('label' in $$new_props) $$invalidate(16, label = $$new_props.label);
    		if ('hideLabel' in $$new_props) $$invalidate(17, hideLabel = $$new_props.hideLabel);
    		if ('translateWithId' in $$new_props) $$invalidate(18, translateWithId = $$new_props.translateWithId);
    		if ('id' in $$new_props) $$invalidate(19, id = $$new_props.id);
    		if ('name' in $$new_props) $$invalidate(20, name = $$new_props.name);
    		if ('ref' in $$new_props) $$invalidate(2, ref = $$new_props.ref);
    		if ('$$scope' in $$new_props) $$invalidate(37, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		items,
    		itemToString,
    		selectedId,
    		type,
    		direction,
    		size,
    		open,
    		light,
    		disabled,
    		titleText,
    		invalid,
    		invalidText,
    		warn,
    		warnText,
    		helperText,
    		label,
    		hideLabel,
    		translateWithId,
    		id,
    		name,
    		ref,
    		createEventDispatcher,
    		onMount,
    		WarningFilled: WarningFilled$1,
    		WarningAltFilled: WarningAltFilled$1,
    		ListBox: ListBox$1,
    		ListBoxMenu: ListBoxMenu$1,
    		ListBoxMenuIcon: ListBoxMenuIcon$1,
    		ListBoxMenuItem: ListBoxMenuItem$1,
    		dispatch,
    		highlightedIndex,
    		change,
    		dispatchSelect,
    		pageClickHandler,
    		selectedItem,
    		inline
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(28, $$props = assign(assign({}, $$props), $$new_props));
    		if ('items' in $$props) $$invalidate(3, items = $$new_props.items);
    		if ('itemToString' in $$props) $$invalidate(4, itemToString = $$new_props.itemToString);
    		if ('selectedId' in $$props) $$invalidate(0, selectedId = $$new_props.selectedId);
    		if ('type' in $$props) $$invalidate(5, type = $$new_props.type);
    		if ('direction' in $$props) $$invalidate(6, direction = $$new_props.direction);
    		if ('size' in $$props) $$invalidate(7, size = $$new_props.size);
    		if ('open' in $$props) $$invalidate(1, open = $$new_props.open);
    		if ('light' in $$props) $$invalidate(8, light = $$new_props.light);
    		if ('disabled' in $$props) $$invalidate(9, disabled = $$new_props.disabled);
    		if ('titleText' in $$props) $$invalidate(10, titleText = $$new_props.titleText);
    		if ('invalid' in $$props) $$invalidate(11, invalid = $$new_props.invalid);
    		if ('invalidText' in $$props) $$invalidate(12, invalidText = $$new_props.invalidText);
    		if ('warn' in $$props) $$invalidate(13, warn = $$new_props.warn);
    		if ('warnText' in $$props) $$invalidate(14, warnText = $$new_props.warnText);
    		if ('helperText' in $$props) $$invalidate(15, helperText = $$new_props.helperText);
    		if ('label' in $$props) $$invalidate(16, label = $$new_props.label);
    		if ('hideLabel' in $$props) $$invalidate(17, hideLabel = $$new_props.hideLabel);
    		if ('translateWithId' in $$props) $$invalidate(18, translateWithId = $$new_props.translateWithId);
    		if ('id' in $$props) $$invalidate(19, id = $$new_props.id);
    		if ('name' in $$props) $$invalidate(20, name = $$new_props.name);
    		if ('ref' in $$props) $$invalidate(2, ref = $$new_props.ref);
    		if ('highlightedIndex' in $$props) $$invalidate(21, highlightedIndex = $$new_props.highlightedIndex);
    		if ('selectedItem' in $$props) $$invalidate(22, selectedItem = $$new_props.selectedItem);
    		if ('inline' in $$props) $$invalidate(23, inline = $$new_props.inline);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*type*/ 32) {
    			$$invalidate(23, inline = type === "inline");
    		}

    		if ($$self.$$.dirty[0] & /*items, selectedId*/ 9) {
    			$$invalidate(22, selectedItem = items.find(item => item.id === selectedId));
    		}

    		if ($$self.$$.dirty[0] & /*open*/ 2) {
    			if (!open) {
    				$$invalidate(21, highlightedIndex = -1);
    			}
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		selectedId,
    		open,
    		ref,
    		items,
    		itemToString,
    		type,
    		direction,
    		size,
    		light,
    		disabled,
    		titleText,
    		invalid,
    		invalidText,
    		warn,
    		warnText,
    		helperText,
    		label,
    		hideLabel,
    		translateWithId,
    		id,
    		name,
    		highlightedIndex,
    		selectedItem,
    		inline,
    		change,
    		dispatchSelect,
    		pageClickHandler,
    		$$restProps,
    		$$props,
    		slots,
    		click_handler,
    		button_binding,
    		keydown_handler,
    		keyup_handler,
    		click_handler_1,
    		mouseenter_handler,
    		click_handler_2,
    		$$scope
    	];
    }

    class Dropdown extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$a,
    			create_fragment$a,
    			safe_not_equal,
    			{
    				items: 3,
    				itemToString: 4,
    				selectedId: 0,
    				type: 5,
    				direction: 6,
    				size: 7,
    				open: 1,
    				light: 8,
    				disabled: 9,
    				titleText: 10,
    				invalid: 11,
    				invalidText: 12,
    				warn: 13,
    				warnText: 14,
    				helperText: 15,
    				label: 16,
    				hideLabel: 17,
    				translateWithId: 18,
    				id: 19,
    				name: 20,
    				ref: 2
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dropdown",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get items() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set items(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get itemToString() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set itemToString(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectedId() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectedId(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get direction() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set direction(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get open() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set open(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get light() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set light(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get titleText() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set titleText(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get invalid() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set invalid(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get invalidText() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set invalidText(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get warn() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set warn(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get warnText() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set warnText(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get helperText() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set helperText(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hideLabel() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hideLabel(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get translateWithId() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set translateWithId(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ref() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Dropdown$1 = Dropdown;

    /* node_modules\carbon-components-svelte\src\icons\CheckmarkFilled.svelte generated by Svelte v3.57.0 */

    const file$8 = "node_modules\\carbon-components-svelte\\src\\icons\\CheckmarkFilled.svelte";

    // (24:2) {#if title}
    function create_if_block$5(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[1]);
    			add_location(title_1, file$8, 23, 13, 549);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 2) set_data_dev(t, /*title*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(24:2) {#if title}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let svg;
    	let path0;
    	let path1;
    	let if_block = /*title*/ ctx[1] && create_if_block$5(ctx);

    	let svg_levels = [
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 32 32" },
    		{ fill: "currentColor" },
    		{ preserveAspectRatio: "xMidYMid meet" },
    		{ width: /*size*/ ctx[0] },
    		{ height: /*size*/ ctx[0] },
    		/*attributes*/ ctx[2],
    		/*$$restProps*/ ctx[3]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			if (if_block) if_block.c();
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M16,2A14,14,0,1,0,30,16,14,14,0,0,0,16,2ZM14,21.5908l-5-5L10.5906,15,14,18.4092,21.41,11l1.5957,1.5859Z");
    			add_location(path0, file$8, 24, 2, 579);
    			attr_dev(path1, "fill", "none");
    			attr_dev(path1, "d", "M14 21.591L9 16.591 10.591 15 14 18.409 21.41 11 23.005 12.585 14 21.591z");
    			attr_dev(path1, "data-icon-path", "inner-path");
    			add_location(path1, file$8, 26, 10, 707);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$8, 13, 0, 338);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			if (if_block) if_block.m(svg, null);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*title*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$5(ctx);
    					if_block.c();
    					if_block.m(svg, path0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 32 32" },
    				{ fill: "currentColor" },
    				{ preserveAspectRatio: "xMidYMid meet" },
    				dirty & /*size*/ 1 && { width: /*size*/ ctx[0] },
    				dirty & /*size*/ 1 && { height: /*size*/ ctx[0] },
    				dirty & /*attributes*/ 4 && /*attributes*/ ctx[2],
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let labelled;
    	let attributes;
    	const omit_props_names = ["size","title"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CheckmarkFilled', slots, []);
    	let { size = 16 } = $$props;
    	let { title = undefined } = $$props;

    	$$self.$$set = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('size' in $$new_props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$new_props) $$invalidate(1, title = $$new_props.title);
    	};

    	$$self.$capture_state = () => ({ size, title, labelled, attributes });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), $$new_props));
    		if ('size' in $$props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$props) $$invalidate(1, title = $$new_props.title);
    		if ('labelled' in $$props) $$invalidate(4, labelled = $$new_props.labelled);
    		if ('attributes' in $$props) $$invalidate(2, attributes = $$new_props.attributes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(4, labelled = $$props["aria-label"] || $$props["aria-labelledby"] || title);

    		$$invalidate(2, attributes = {
    			"aria-hidden": labelled ? undefined : true,
    			role: labelled ? "img" : undefined,
    			focusable: Number($$props["tabindex"]) === 0 ? true : undefined
    		});
    	};

    	$$props = exclude_internal_props($$props);
    	return [size, title, attributes, $$restProps, labelled];
    }

    class CheckmarkFilled extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { size: 0, title: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CheckmarkFilled",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get size() {
    		throw new Error("<CheckmarkFilled>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<CheckmarkFilled>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<CheckmarkFilled>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<CheckmarkFilled>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var CheckmarkFilled$1 = CheckmarkFilled;

    /* node_modules\carbon-components-svelte\src\icons\ErrorFilled.svelte generated by Svelte v3.57.0 */

    const file$7 = "node_modules\\carbon-components-svelte\\src\\icons\\ErrorFilled.svelte";

    // (24:2) {#if title}
    function create_if_block$4(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[1]);
    			add_location(title_1, file$7, 23, 13, 549);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 2) set_data_dev(t, /*title*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(24:2) {#if title}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let svg;
    	let path0;
    	let path1;
    	let if_block = /*title*/ ctx[1] && create_if_block$4(ctx);

    	let svg_levels = [
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 32 32" },
    		{ fill: "currentColor" },
    		{ preserveAspectRatio: "xMidYMid meet" },
    		{ width: /*size*/ ctx[0] },
    		{ height: /*size*/ ctx[0] },
    		/*attributes*/ ctx[2],
    		/*$$restProps*/ ctx[3]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			if (if_block) if_block.c();
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "fill", "none");
    			attr_dev(path0, "d", "M14.9 7.2H17.1V24.799H14.9z");
    			attr_dev(path0, "data-icon-path", "inner-path");
    			attr_dev(path0, "transform", "rotate(-45 16 16)");
    			add_location(path0, file$7, 24, 2, 579);
    			attr_dev(path1, "d", "M16,2A13.914,13.914,0,0,0,2,16,13.914,13.914,0,0,0,16,30,13.914,13.914,0,0,0,30,16,13.914,13.914,0,0,0,16,2Zm5.4449,21L9,10.5557,10.5557,9,23,21.4448Z");
    			add_location(path1, file$7, 28, 41, 710);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$7, 13, 0, 338);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			if (if_block) if_block.m(svg, null);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*title*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					if_block.m(svg, path0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 32 32" },
    				{ fill: "currentColor" },
    				{ preserveAspectRatio: "xMidYMid meet" },
    				dirty & /*size*/ 1 && { width: /*size*/ ctx[0] },
    				dirty & /*size*/ 1 && { height: /*size*/ ctx[0] },
    				dirty & /*attributes*/ 4 && /*attributes*/ ctx[2],
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let labelled;
    	let attributes;
    	const omit_props_names = ["size","title"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ErrorFilled', slots, []);
    	let { size = 16 } = $$props;
    	let { title = undefined } = $$props;

    	$$self.$$set = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('size' in $$new_props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$new_props) $$invalidate(1, title = $$new_props.title);
    	};

    	$$self.$capture_state = () => ({ size, title, labelled, attributes });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), $$new_props));
    		if ('size' in $$props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$props) $$invalidate(1, title = $$new_props.title);
    		if ('labelled' in $$props) $$invalidate(4, labelled = $$new_props.labelled);
    		if ('attributes' in $$props) $$invalidate(2, attributes = $$new_props.attributes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(4, labelled = $$props["aria-label"] || $$props["aria-labelledby"] || title);

    		$$invalidate(2, attributes = {
    			"aria-hidden": labelled ? undefined : true,
    			role: labelled ? "img" : undefined,
    			focusable: Number($$props["tabindex"]) === 0 ? true : undefined
    		});
    	};

    	$$props = exclude_internal_props($$props);
    	return [size, title, attributes, $$restProps, labelled];
    }

    class ErrorFilled extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { size: 0, title: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ErrorFilled",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get size() {
    		throw new Error("<ErrorFilled>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<ErrorFilled>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<ErrorFilled>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<ErrorFilled>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var ErrorFilled$1 = ErrorFilled;

    /* node_modules\carbon-components-svelte\src\Notification\NotificationButton.svelte generated by Svelte v3.57.0 */
    const file$6 = "node_modules\\carbon-components-svelte\\src\\Notification\\NotificationButton.svelte";

    function create_fragment$7(ctx) {
    	let button;
    	let switch_instance;
    	let current;
    	let mounted;
    	let dispose;
    	var switch_value = /*icon*/ ctx[1];

    	function switch_props(ctx) {
    		return {
    			props: {
    				size: 20,
    				title: /*title*/ ctx[2],
    				class: "" + ((/*notificationType*/ ctx[0] === 'toast' && 'bx--toast-notification__close-icon') + " " + (/*notificationType*/ ctx[0] === 'inline' && 'bx--inline-notification__close-icon'))
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    	}

    	let button_levels = [
    		{ type: "button" },
    		{ "aria-label": /*iconDescription*/ ctx[3] },
    		{ title: /*iconDescription*/ ctx[3] },
    		/*$$restProps*/ ctx[4]
    	];

    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			set_attributes(button, button_data);
    			toggle_class(button, "bx--toast-notification__close-button", /*notificationType*/ ctx[0] === 'toast');
    			toggle_class(button, "bx--inline-notification__close-button", /*notificationType*/ ctx[0] === 'inline');
    			add_location(button, file$6, 26, 0, 558);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			if (switch_instance) mount_component(switch_instance, button, null);
    			if (button.autofocus) button.focus();
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*click_handler*/ ctx[5], false, false, false, false),
    					listen_dev(button, "mouseover", /*mouseover_handler*/ ctx[6], false, false, false, false),
    					listen_dev(button, "mouseenter", /*mouseenter_handler*/ ctx[7], false, false, false, false),
    					listen_dev(button, "mouseleave", /*mouseleave_handler*/ ctx[8], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const switch_instance_changes = {};
    			if (dirty & /*title*/ 4) switch_instance_changes.title = /*title*/ ctx[2];
    			if (dirty & /*notificationType*/ 1) switch_instance_changes.class = "" + ((/*notificationType*/ ctx[0] === 'toast' && 'bx--toast-notification__close-icon') + " " + (/*notificationType*/ ctx[0] === 'inline' && 'bx--inline-notification__close-icon'));

    			if (dirty & /*icon*/ 2 && switch_value !== (switch_value = /*icon*/ ctx[1])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, button, null);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}

    			set_attributes(button, button_data = get_spread_update(button_levels, [
    				{ type: "button" },
    				(!current || dirty & /*iconDescription*/ 8) && { "aria-label": /*iconDescription*/ ctx[3] },
    				(!current || dirty & /*iconDescription*/ 8) && { title: /*iconDescription*/ ctx[3] },
    				dirty & /*$$restProps*/ 16 && /*$$restProps*/ ctx[4]
    			]));

    			toggle_class(button, "bx--toast-notification__close-button", /*notificationType*/ ctx[0] === 'toast');
    			toggle_class(button, "bx--inline-notification__close-button", /*notificationType*/ ctx[0] === 'inline');
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (switch_instance) destroy_component(switch_instance);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	const omit_props_names = ["notificationType","icon","title","iconDescription"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NotificationButton', slots, []);
    	let { notificationType = "toast" } = $$props;
    	let { icon = Close$1 } = $$props;
    	let { title = undefined } = $$props;
    	let { iconDescription = "Close icon" } = $$props;

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(4, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('notificationType' in $$new_props) $$invalidate(0, notificationType = $$new_props.notificationType);
    		if ('icon' in $$new_props) $$invalidate(1, icon = $$new_props.icon);
    		if ('title' in $$new_props) $$invalidate(2, title = $$new_props.title);
    		if ('iconDescription' in $$new_props) $$invalidate(3, iconDescription = $$new_props.iconDescription);
    	};

    	$$self.$capture_state = () => ({
    		notificationType,
    		icon,
    		title,
    		iconDescription,
    		Close: Close$1
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('notificationType' in $$props) $$invalidate(0, notificationType = $$new_props.notificationType);
    		if ('icon' in $$props) $$invalidate(1, icon = $$new_props.icon);
    		if ('title' in $$props) $$invalidate(2, title = $$new_props.title);
    		if ('iconDescription' in $$props) $$invalidate(3, iconDescription = $$new_props.iconDescription);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		notificationType,
    		icon,
    		title,
    		iconDescription,
    		$$restProps,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler
    	];
    }

    class NotificationButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {
    			notificationType: 0,
    			icon: 1,
    			title: 2,
    			iconDescription: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NotificationButton",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get notificationType() {
    		throw new Error("<NotificationButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set notificationType(value) {
    		throw new Error("<NotificationButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get icon() {
    		throw new Error("<NotificationButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<NotificationButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<NotificationButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<NotificationButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconDescription() {
    		throw new Error("<NotificationButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconDescription(value) {
    		throw new Error("<NotificationButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var NotificationButton$1 = NotificationButton;

    /* node_modules\carbon-components-svelte\src\icons\InformationFilled.svelte generated by Svelte v3.57.0 */

    const file$5 = "node_modules\\carbon-components-svelte\\src\\icons\\InformationFilled.svelte";

    // (24:2) {#if title}
    function create_if_block$3(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[1]);
    			add_location(title_1, file$5, 23, 13, 549);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 2) set_data_dev(t, /*title*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(24:2) {#if title}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let svg;
    	let path0;
    	let path1;
    	let if_block = /*title*/ ctx[1] && create_if_block$3(ctx);

    	let svg_levels = [
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 32 32" },
    		{ fill: "currentColor" },
    		{ preserveAspectRatio: "xMidYMid meet" },
    		{ width: /*size*/ ctx[0] },
    		{ height: /*size*/ ctx[0] },
    		/*attributes*/ ctx[2],
    		/*$$restProps*/ ctx[3]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			if (if_block) if_block.c();
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "fill", "none");
    			attr_dev(path0, "d", "M16,8a1.5,1.5,0,1,1-1.5,1.5A1.5,1.5,0,0,1,16,8Zm4,13.875H17.125v-8H13v2.25h1.875v5.75H12v2.25h8Z");
    			attr_dev(path0, "data-icon-path", "inner-path");
    			add_location(path0, file$5, 24, 2, 579);
    			attr_dev(path1, "d", "M16,2A14,14,0,1,0,30,16,14,14,0,0,0,16,2Zm0,6a1.5,1.5,0,1,1-1.5,1.5A1.5,1.5,0,0,1,16,8Zm4,16.125H12v-2.25h2.875v-5.75H13v-2.25h4.125v8H20Z");
    			add_location(path1, file$5, 27, 39, 745);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$5, 13, 0, 338);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			if (if_block) if_block.m(svg, null);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*title*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					if_block.m(svg, path0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 32 32" },
    				{ fill: "currentColor" },
    				{ preserveAspectRatio: "xMidYMid meet" },
    				dirty & /*size*/ 1 && { width: /*size*/ ctx[0] },
    				dirty & /*size*/ 1 && { height: /*size*/ ctx[0] },
    				dirty & /*attributes*/ 4 && /*attributes*/ ctx[2],
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let labelled;
    	let attributes;
    	const omit_props_names = ["size","title"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('InformationFilled', slots, []);
    	let { size = 16 } = $$props;
    	let { title = undefined } = $$props;

    	$$self.$$set = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('size' in $$new_props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$new_props) $$invalidate(1, title = $$new_props.title);
    	};

    	$$self.$capture_state = () => ({ size, title, labelled, attributes });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), $$new_props));
    		if ('size' in $$props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$props) $$invalidate(1, title = $$new_props.title);
    		if ('labelled' in $$props) $$invalidate(4, labelled = $$new_props.labelled);
    		if ('attributes' in $$props) $$invalidate(2, attributes = $$new_props.attributes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(4, labelled = $$props["aria-label"] || $$props["aria-labelledby"] || title);

    		$$invalidate(2, attributes = {
    			"aria-hidden": labelled ? undefined : true,
    			role: labelled ? "img" : undefined,
    			focusable: Number($$props["tabindex"]) === 0 ? true : undefined
    		});
    	};

    	$$props = exclude_internal_props($$props);
    	return [size, title, attributes, $$restProps, labelled];
    }

    class InformationFilled extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { size: 0, title: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InformationFilled",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get size() {
    		throw new Error("<InformationFilled>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<InformationFilled>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<InformationFilled>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<InformationFilled>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var InformationFilled$1 = InformationFilled;

    /* node_modules\carbon-components-svelte\src\icons\InformationSquareFilled.svelte generated by Svelte v3.57.0 */

    const file$4 = "node_modules\\carbon-components-svelte\\src\\icons\\InformationSquareFilled.svelte";

    // (24:2) {#if title}
    function create_if_block$2(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[1]);
    			add_location(title_1, file$4, 23, 13, 549);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 2) set_data_dev(t, /*title*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(24:2) {#if title}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let svg;
    	let path0;
    	let path1;
    	let if_block = /*title*/ ctx[1] && create_if_block$2(ctx);

    	let svg_levels = [
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 32 32" },
    		{ fill: "currentColor" },
    		{ preserveAspectRatio: "xMidYMid meet" },
    		{ width: /*size*/ ctx[0] },
    		{ height: /*size*/ ctx[0] },
    		/*attributes*/ ctx[2],
    		/*$$restProps*/ ctx[3]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			if (if_block) if_block.c();
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "fill", "none");
    			attr_dev(path0, "d", "M16,8a1.5,1.5,0,1,1-1.5,1.5A1.5,1.5,0,0,1,16,8Zm4,13.875H17.125v-8H13v2.25h1.875v5.75H12v2.25h8Z");
    			attr_dev(path0, "data-icon-path", "inner-path");
    			add_location(path0, file$4, 24, 2, 579);
    			attr_dev(path1, "d", "M26,4H6A2,2,0,0,0,4,6V26a2,2,0,0,0,2,2H26a2,2,0,0,0,2-2V6A2,2,0,0,0,26,4ZM16,8a1.5,1.5,0,1,1-1.5,1.5A1.5,1.5,0,0,1,16,8Zm4,16.125H12v-2.25h2.875v-5.75H13v-2.25h4.125v8H20Z");
    			add_location(path1, file$4, 27, 39, 745);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$4, 13, 0, 338);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			if (if_block) if_block.m(svg, null);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*title*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					if_block.m(svg, path0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 32 32" },
    				{ fill: "currentColor" },
    				{ preserveAspectRatio: "xMidYMid meet" },
    				dirty & /*size*/ 1 && { width: /*size*/ ctx[0] },
    				dirty & /*size*/ 1 && { height: /*size*/ ctx[0] },
    				dirty & /*attributes*/ 4 && /*attributes*/ ctx[2],
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let labelled;
    	let attributes;
    	const omit_props_names = ["size","title"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('InformationSquareFilled', slots, []);
    	let { size = 16 } = $$props;
    	let { title = undefined } = $$props;

    	$$self.$$set = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('size' in $$new_props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$new_props) $$invalidate(1, title = $$new_props.title);
    	};

    	$$self.$capture_state = () => ({ size, title, labelled, attributes });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), $$new_props));
    		if ('size' in $$props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$props) $$invalidate(1, title = $$new_props.title);
    		if ('labelled' in $$props) $$invalidate(4, labelled = $$new_props.labelled);
    		if ('attributes' in $$props) $$invalidate(2, attributes = $$new_props.attributes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(4, labelled = $$props["aria-label"] || $$props["aria-labelledby"] || title);

    		$$invalidate(2, attributes = {
    			"aria-hidden": labelled ? undefined : true,
    			role: labelled ? "img" : undefined,
    			focusable: Number($$props["tabindex"]) === 0 ? true : undefined
    		});
    	};

    	$$props = exclude_internal_props($$props);
    	return [size, title, attributes, $$restProps, labelled];
    }

    class InformationSquareFilled extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { size: 0, title: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InformationSquareFilled",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get size() {
    		throw new Error("<InformationSquareFilled>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<InformationSquareFilled>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<InformationSquareFilled>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<InformationSquareFilled>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var InformationSquareFilled$1 = InformationSquareFilled;

    /* node_modules\carbon-components-svelte\src\Notification\NotificationIcon.svelte generated by Svelte v3.57.0 */

    function create_fragment$4(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*icons*/ ctx[3][/*kind*/ ctx[0]];

    	function switch_props(ctx) {
    		return {
    			props: {
    				size: 20,
    				title: /*iconDescription*/ ctx[2],
    				class: "" + ((/*notificationType*/ ctx[1] === 'toast' && 'bx--toast-notification__icon') + " " + (/*notificationType*/ ctx[1] === 'inline' && 'bx--inline-notification__icon'))
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const switch_instance_changes = {};
    			if (dirty & /*iconDescription*/ 4) switch_instance_changes.title = /*iconDescription*/ ctx[2];
    			if (dirty & /*notificationType*/ 2) switch_instance_changes.class = "" + ((/*notificationType*/ ctx[1] === 'toast' && 'bx--toast-notification__icon') + " " + (/*notificationType*/ ctx[1] === 'inline' && 'bx--inline-notification__icon'));

    			if (dirty & /*kind*/ 1 && switch_value !== (switch_value = /*icons*/ ctx[3][/*kind*/ ctx[0]])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NotificationIcon', slots, []);
    	let { kind = "error" } = $$props;
    	let { notificationType = "toast" } = $$props;
    	let { iconDescription } = $$props;

    	const icons = {
    		error: ErrorFilled$1,
    		"info-square": InformationSquareFilled$1,
    		info: InformationFilled$1,
    		success: CheckmarkFilled$1,
    		warning: WarningFilled$1,
    		"warning-alt": WarningAltFilled$1
    	};

    	$$self.$$.on_mount.push(function () {
    		if (iconDescription === undefined && !('iconDescription' in $$props || $$self.$$.bound[$$self.$$.props['iconDescription']])) {
    			console.warn("<NotificationIcon> was created without expected prop 'iconDescription'");
    		}
    	});

    	const writable_props = ['kind', 'notificationType', 'iconDescription'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<NotificationIcon> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('kind' in $$props) $$invalidate(0, kind = $$props.kind);
    		if ('notificationType' in $$props) $$invalidate(1, notificationType = $$props.notificationType);
    		if ('iconDescription' in $$props) $$invalidate(2, iconDescription = $$props.iconDescription);
    	};

    	$$self.$capture_state = () => ({
    		kind,
    		notificationType,
    		iconDescription,
    		CheckmarkFilled: CheckmarkFilled$1,
    		ErrorFilled: ErrorFilled$1,
    		InformationFilled: InformationFilled$1,
    		InformationSquareFilled: InformationSquareFilled$1,
    		WarningFilled: WarningFilled$1,
    		WarningAltFilled: WarningAltFilled$1,
    		icons
    	});

    	$$self.$inject_state = $$props => {
    		if ('kind' in $$props) $$invalidate(0, kind = $$props.kind);
    		if ('notificationType' in $$props) $$invalidate(1, notificationType = $$props.notificationType);
    		if ('iconDescription' in $$props) $$invalidate(2, iconDescription = $$props.iconDescription);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [kind, notificationType, iconDescription, icons];
    }

    class NotificationIcon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
    			kind: 0,
    			notificationType: 1,
    			iconDescription: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NotificationIcon",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get kind() {
    		throw new Error("<NotificationIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set kind(value) {
    		throw new Error("<NotificationIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get notificationType() {
    		throw new Error("<NotificationIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set notificationType(value) {
    		throw new Error("<NotificationIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconDescription() {
    		throw new Error("<NotificationIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconDescription(value) {
    		throw new Error("<NotificationIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var NotificationIcon$1 = NotificationIcon;

    /* node_modules\carbon-components-svelte\src\Notification\ToastNotification.svelte generated by Svelte v3.57.0 */
    const file$3 = "node_modules\\carbon-components-svelte\\src\\Notification\\ToastNotification.svelte";
    const get_caption_slot_changes = dirty => ({});
    const get_caption_slot_context = ctx => ({});
    const get_subtitle_slot_changes = dirty => ({});
    const get_subtitle_slot_context = ctx => ({});
    const get_title_slot_changes = dirty => ({});
    const get_title_slot_context = ctx => ({});

    // (80:0) {#if open}
    function create_if_block$1(ctx) {
    	let div3;
    	let notificationicon;
    	let t0;
    	let div2;
    	let h3;
    	let t1;
    	let div0;
    	let t2;
    	let div1;
    	let t3;
    	let t4;
    	let div3_style_value;
    	let current;
    	let mounted;
    	let dispose;

    	notificationicon = new NotificationIcon$1({
    			props: {
    				kind: /*kind*/ ctx[0],
    				iconDescription: /*statusIconDescription*/ ctx[6]
    			},
    			$$inline: true
    		});

    	const title_slot_template = /*#slots*/ ctx[15].title;
    	const title_slot = create_slot(title_slot_template, ctx, /*$$scope*/ ctx[14], get_title_slot_context);
    	const title_slot_or_fallback = title_slot || fallback_block_2(ctx);
    	const subtitle_slot_template = /*#slots*/ ctx[15].subtitle;
    	const subtitle_slot = create_slot(subtitle_slot_template, ctx, /*$$scope*/ ctx[14], get_subtitle_slot_context);
    	const subtitle_slot_or_fallback = subtitle_slot || fallback_block_1(ctx);
    	const caption_slot_template = /*#slots*/ ctx[15].caption;
    	const caption_slot = create_slot(caption_slot_template, ctx, /*$$scope*/ ctx[14], get_caption_slot_context);
    	const caption_slot_or_fallback = caption_slot || fallback_block(ctx);
    	const default_slot_template = /*#slots*/ ctx[15].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[14], null);
    	let if_block = !/*hideCloseButton*/ ctx[8] && create_if_block_1(ctx);

    	let div3_levels = [
    		{ role: /*role*/ ctx[2] },
    		{ kind: /*kind*/ ctx[0] },
    		/*$$restProps*/ ctx[12],
    		{
    			style: div3_style_value = "" + ((/*fullWidth*/ ctx[9] && 'width: 100%;') + /*$$restProps*/ ctx[12].style)
    		}
    	];

    	let div3_data = {};

    	for (let i = 0; i < div3_levels.length; i += 1) {
    		div3_data = assign(div3_data, div3_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			create_component(notificationicon.$$.fragment);
    			t0 = space();
    			div2 = element("div");
    			h3 = element("h3");
    			if (title_slot_or_fallback) title_slot_or_fallback.c();
    			t1 = space();
    			div0 = element("div");
    			if (subtitle_slot_or_fallback) subtitle_slot_or_fallback.c();
    			t2 = space();
    			div1 = element("div");
    			if (caption_slot_or_fallback) caption_slot_or_fallback.c();
    			t3 = space();
    			if (default_slot) default_slot.c();
    			t4 = space();
    			if (if_block) if_block.c();
    			toggle_class(h3, "bx--toast-notification__title", true);
    			add_location(h3, file$3, 100, 6, 2740);
    			toggle_class(div0, "bx--toast-notification__subtitle", true);
    			add_location(div0, file$3, 103, 6, 2850);
    			toggle_class(div1, "bx--toast-notification__caption", true);
    			add_location(div1, file$3, 106, 6, 2971);
    			toggle_class(div2, "bx--toast-notification__details", true);
    			add_location(div2, file$3, 99, 4, 2681);
    			set_attributes(div3, div3_data);
    			toggle_class(div3, "bx--toast-notification", true);
    			toggle_class(div3, "bx--toast-notification--low-contrast", /*lowContrast*/ ctx[1]);
    			toggle_class(div3, "bx--toast-notification--error", /*kind*/ ctx[0] === 'error');
    			toggle_class(div3, "bx--toast-notification--info", /*kind*/ ctx[0] === 'info');
    			toggle_class(div3, "bx--toast-notification--info-square", /*kind*/ ctx[0] === 'info-square');
    			toggle_class(div3, "bx--toast-notification--success", /*kind*/ ctx[0] === 'success');
    			toggle_class(div3, "bx--toast-notification--warning", /*kind*/ ctx[0] === 'warning');
    			toggle_class(div3, "bx--toast-notification--warning-alt", /*kind*/ ctx[0] === 'warning-alt');
    			add_location(div3, file$3, 80, 2, 1902);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			mount_component(notificationicon, div3, null);
    			append_dev(div3, t0);
    			append_dev(div3, div2);
    			append_dev(div2, h3);

    			if (title_slot_or_fallback) {
    				title_slot_or_fallback.m(h3, null);
    			}

    			append_dev(div2, t1);
    			append_dev(div2, div0);

    			if (subtitle_slot_or_fallback) {
    				subtitle_slot_or_fallback.m(div0, null);
    			}

    			append_dev(div2, t2);
    			append_dev(div2, div1);

    			if (caption_slot_or_fallback) {
    				caption_slot_or_fallback.m(div1, null);
    			}

    			append_dev(div2, t3);

    			if (default_slot) {
    				default_slot.m(div2, null);
    			}

    			append_dev(div3, t4);
    			if (if_block) if_block.m(div3, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div3, "click", /*click_handler*/ ctx[16], false, false, false, false),
    					listen_dev(div3, "mouseover", /*mouseover_handler*/ ctx[17], false, false, false, false),
    					listen_dev(div3, "mouseenter", /*mouseenter_handler*/ ctx[18], false, false, false, false),
    					listen_dev(div3, "mouseleave", /*mouseleave_handler*/ ctx[19], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const notificationicon_changes = {};
    			if (dirty & /*kind*/ 1) notificationicon_changes.kind = /*kind*/ ctx[0];
    			if (dirty & /*statusIconDescription*/ 64) notificationicon_changes.iconDescription = /*statusIconDescription*/ ctx[6];
    			notificationicon.$set(notificationicon_changes);

    			if (title_slot) {
    				if (title_slot.p && (!current || dirty & /*$$scope*/ 16384)) {
    					update_slot_base(
    						title_slot,
    						title_slot_template,
    						ctx,
    						/*$$scope*/ ctx[14],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[14])
    						: get_slot_changes(title_slot_template, /*$$scope*/ ctx[14], dirty, get_title_slot_changes),
    						get_title_slot_context
    					);
    				}
    			} else {
    				if (title_slot_or_fallback && title_slot_or_fallback.p && (!current || dirty & /*title*/ 8)) {
    					title_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			if (subtitle_slot) {
    				if (subtitle_slot.p && (!current || dirty & /*$$scope*/ 16384)) {
    					update_slot_base(
    						subtitle_slot,
    						subtitle_slot_template,
    						ctx,
    						/*$$scope*/ ctx[14],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[14])
    						: get_slot_changes(subtitle_slot_template, /*$$scope*/ ctx[14], dirty, get_subtitle_slot_changes),
    						get_subtitle_slot_context
    					);
    				}
    			} else {
    				if (subtitle_slot_or_fallback && subtitle_slot_or_fallback.p && (!current || dirty & /*subtitle*/ 16)) {
    					subtitle_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			if (caption_slot) {
    				if (caption_slot.p && (!current || dirty & /*$$scope*/ 16384)) {
    					update_slot_base(
    						caption_slot,
    						caption_slot_template,
    						ctx,
    						/*$$scope*/ ctx[14],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[14])
    						: get_slot_changes(caption_slot_template, /*$$scope*/ ctx[14], dirty, get_caption_slot_changes),
    						get_caption_slot_context
    					);
    				}
    			} else {
    				if (caption_slot_or_fallback && caption_slot_or_fallback.p && (!current || dirty & /*caption*/ 32)) {
    					caption_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16384)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[14],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[14])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[14], dirty, null),
    						null
    					);
    				}
    			}

    			if (!/*hideCloseButton*/ ctx[8]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*hideCloseButton*/ 256) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div3, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			set_attributes(div3, div3_data = get_spread_update(div3_levels, [
    				(!current || dirty & /*role*/ 4) && { role: /*role*/ ctx[2] },
    				(!current || dirty & /*kind*/ 1) && { kind: /*kind*/ ctx[0] },
    				dirty & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12],
    				(!current || dirty & /*fullWidth, $$restProps*/ 4608 && div3_style_value !== (div3_style_value = "" + ((/*fullWidth*/ ctx[9] && 'width: 100%;') + /*$$restProps*/ ctx[12].style))) && { style: div3_style_value }
    			]));

    			toggle_class(div3, "bx--toast-notification", true);
    			toggle_class(div3, "bx--toast-notification--low-contrast", /*lowContrast*/ ctx[1]);
    			toggle_class(div3, "bx--toast-notification--error", /*kind*/ ctx[0] === 'error');
    			toggle_class(div3, "bx--toast-notification--info", /*kind*/ ctx[0] === 'info');
    			toggle_class(div3, "bx--toast-notification--info-square", /*kind*/ ctx[0] === 'info-square');
    			toggle_class(div3, "bx--toast-notification--success", /*kind*/ ctx[0] === 'success');
    			toggle_class(div3, "bx--toast-notification--warning", /*kind*/ ctx[0] === 'warning');
    			toggle_class(div3, "bx--toast-notification--warning-alt", /*kind*/ ctx[0] === 'warning-alt');
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(notificationicon.$$.fragment, local);
    			transition_in(title_slot_or_fallback, local);
    			transition_in(subtitle_slot_or_fallback, local);
    			transition_in(caption_slot_or_fallback, local);
    			transition_in(default_slot, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(notificationicon.$$.fragment, local);
    			transition_out(title_slot_or_fallback, local);
    			transition_out(subtitle_slot_or_fallback, local);
    			transition_out(caption_slot_or_fallback, local);
    			transition_out(default_slot, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_component(notificationicon);
    			if (title_slot_or_fallback) title_slot_or_fallback.d(detaching);
    			if (subtitle_slot_or_fallback) subtitle_slot_or_fallback.d(detaching);
    			if (caption_slot_or_fallback) caption_slot_or_fallback.d(detaching);
    			if (default_slot) default_slot.d(detaching);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(80:0) {#if open}",
    		ctx
    	});

    	return block;
    }

    // (102:27) {title}
    function fallback_block_2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*title*/ ctx[3]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 8) set_data_dev(t, /*title*/ ctx[3]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_2.name,
    		type: "fallback",
    		source: "(102:27) {title}",
    		ctx
    	});

    	return block;
    }

    // (105:30) {subtitle}
    function fallback_block_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*subtitle*/ ctx[4]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*subtitle*/ 16) set_data_dev(t, /*subtitle*/ ctx[4]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_1.name,
    		type: "fallback",
    		source: "(105:30) {subtitle}",
    		ctx
    	});

    	return block;
    }

    // (108:29) {caption}
    function fallback_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*caption*/ ctx[5]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*caption*/ 32) set_data_dev(t, /*caption*/ ctx[5]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(108:29) {caption}",
    		ctx
    	});

    	return block;
    }

    // (112:4) {#if !hideCloseButton}
    function create_if_block_1(ctx) {
    	let notificationbutton;
    	let current;

    	notificationbutton = new NotificationButton$1({
    			props: {
    				iconDescription: /*closeButtonDescription*/ ctx[7]
    			},
    			$$inline: true
    		});

    	notificationbutton.$on("click", /*close*/ ctx[11]);

    	const block = {
    		c: function create() {
    			create_component(notificationbutton.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(notificationbutton, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const notificationbutton_changes = {};
    			if (dirty & /*closeButtonDescription*/ 128) notificationbutton_changes.iconDescription = /*closeButtonDescription*/ ctx[7];
    			notificationbutton.$set(notificationbutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(notificationbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(notificationbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(notificationbutton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(112:4) {#if !hideCloseButton}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*open*/ ctx[10] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*open*/ ctx[10]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*open*/ 1024) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"kind","lowContrast","timeout","role","title","subtitle","caption","statusIconDescription","closeButtonDescription","hideCloseButton","fullWidth"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ToastNotification', slots, ['title','subtitle','caption','default']);
    	let { kind = "error" } = $$props;
    	let { lowContrast = false } = $$props;
    	let { timeout = 0 } = $$props;
    	let { role = "alert" } = $$props;
    	let { title = "" } = $$props;
    	let { subtitle = "" } = $$props;
    	let { caption = "" } = $$props;
    	let { statusIconDescription = kind + " icon" } = $$props;
    	let { closeButtonDescription = "Close notification" } = $$props;
    	let { hideCloseButton = false } = $$props;
    	let { fullWidth = false } = $$props;
    	const dispatch = createEventDispatcher();
    	let open = true;
    	let timeoutId = undefined;

    	function close(closeFromTimeout) {
    		const shouldContinue = dispatch("close", { timeout: closeFromTimeout === true }, { cancelable: true });

    		if (shouldContinue) {
    			$$invalidate(10, open = false);
    		}
    	}

    	onMount(() => {
    		if (timeout) {
    			timeoutId = setTimeout(() => close(true), timeout);
    		}

    		return () => {
    			clearTimeout(timeoutId);
    		};
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(12, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('kind' in $$new_props) $$invalidate(0, kind = $$new_props.kind);
    		if ('lowContrast' in $$new_props) $$invalidate(1, lowContrast = $$new_props.lowContrast);
    		if ('timeout' in $$new_props) $$invalidate(13, timeout = $$new_props.timeout);
    		if ('role' in $$new_props) $$invalidate(2, role = $$new_props.role);
    		if ('title' in $$new_props) $$invalidate(3, title = $$new_props.title);
    		if ('subtitle' in $$new_props) $$invalidate(4, subtitle = $$new_props.subtitle);
    		if ('caption' in $$new_props) $$invalidate(5, caption = $$new_props.caption);
    		if ('statusIconDescription' in $$new_props) $$invalidate(6, statusIconDescription = $$new_props.statusIconDescription);
    		if ('closeButtonDescription' in $$new_props) $$invalidate(7, closeButtonDescription = $$new_props.closeButtonDescription);
    		if ('hideCloseButton' in $$new_props) $$invalidate(8, hideCloseButton = $$new_props.hideCloseButton);
    		if ('fullWidth' in $$new_props) $$invalidate(9, fullWidth = $$new_props.fullWidth);
    		if ('$$scope' in $$new_props) $$invalidate(14, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		kind,
    		lowContrast,
    		timeout,
    		role,
    		title,
    		subtitle,
    		caption,
    		statusIconDescription,
    		closeButtonDescription,
    		hideCloseButton,
    		fullWidth,
    		createEventDispatcher,
    		onMount,
    		NotificationButton: NotificationButton$1,
    		NotificationIcon: NotificationIcon$1,
    		dispatch,
    		open,
    		timeoutId,
    		close
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('kind' in $$props) $$invalidate(0, kind = $$new_props.kind);
    		if ('lowContrast' in $$props) $$invalidate(1, lowContrast = $$new_props.lowContrast);
    		if ('timeout' in $$props) $$invalidate(13, timeout = $$new_props.timeout);
    		if ('role' in $$props) $$invalidate(2, role = $$new_props.role);
    		if ('title' in $$props) $$invalidate(3, title = $$new_props.title);
    		if ('subtitle' in $$props) $$invalidate(4, subtitle = $$new_props.subtitle);
    		if ('caption' in $$props) $$invalidate(5, caption = $$new_props.caption);
    		if ('statusIconDescription' in $$props) $$invalidate(6, statusIconDescription = $$new_props.statusIconDescription);
    		if ('closeButtonDescription' in $$props) $$invalidate(7, closeButtonDescription = $$new_props.closeButtonDescription);
    		if ('hideCloseButton' in $$props) $$invalidate(8, hideCloseButton = $$new_props.hideCloseButton);
    		if ('fullWidth' in $$props) $$invalidate(9, fullWidth = $$new_props.fullWidth);
    		if ('open' in $$props) $$invalidate(10, open = $$new_props.open);
    		if ('timeoutId' in $$props) timeoutId = $$new_props.timeoutId;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		kind,
    		lowContrast,
    		role,
    		title,
    		subtitle,
    		caption,
    		statusIconDescription,
    		closeButtonDescription,
    		hideCloseButton,
    		fullWidth,
    		open,
    		close,
    		$$restProps,
    		timeout,
    		$$scope,
    		slots,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler
    	];
    }

    class ToastNotification extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
    			kind: 0,
    			lowContrast: 1,
    			timeout: 13,
    			role: 2,
    			title: 3,
    			subtitle: 4,
    			caption: 5,
    			statusIconDescription: 6,
    			closeButtonDescription: 7,
    			hideCloseButton: 8,
    			fullWidth: 9
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ToastNotification",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get kind() {
    		throw new Error("<ToastNotification>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set kind(value) {
    		throw new Error("<ToastNotification>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get lowContrast() {
    		throw new Error("<ToastNotification>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lowContrast(value) {
    		throw new Error("<ToastNotification>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get timeout() {
    		throw new Error("<ToastNotification>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set timeout(value) {
    		throw new Error("<ToastNotification>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get role() {
    		throw new Error("<ToastNotification>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set role(value) {
    		throw new Error("<ToastNotification>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<ToastNotification>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<ToastNotification>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get subtitle() {
    		throw new Error("<ToastNotification>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set subtitle(value) {
    		throw new Error("<ToastNotification>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get caption() {
    		throw new Error("<ToastNotification>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set caption(value) {
    		throw new Error("<ToastNotification>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get statusIconDescription() {
    		throw new Error("<ToastNotification>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set statusIconDescription(value) {
    		throw new Error("<ToastNotification>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeButtonDescription() {
    		throw new Error("<ToastNotification>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeButtonDescription(value) {
    		throw new Error("<ToastNotification>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hideCloseButton() {
    		throw new Error("<ToastNotification>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hideCloseButton(value) {
    		throw new Error("<ToastNotification>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fullWidth() {
    		throw new Error("<ToastNotification>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fullWidth(value) {
    		throw new Error("<ToastNotification>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var ToastNotification$1 = ToastNotification;

    const columnsStore = writable(12);

    /* node_modules\svelte-grid-responsive\dist\Grid.svelte generated by Svelte v3.57.0 */
    const file$2 = "node_modules\\svelte-grid-responsive\\dist\\Grid.svelte";

    function create_fragment$2(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[18].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[17], null);

    	let div_levels = [
    		/*$$restProps*/ ctx[2],
    		{ style: /*styleGeneral*/ ctx[1] },
    		{ class: /*classGeneral*/ ctx[0] }
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			toggle_class(div, "svelte-zbu7j0", true);
    			add_location(div, file$2, 87, 0, 2927);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 131072)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[17],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[17])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[17], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 4 && /*$$restProps*/ ctx[2],
    				(!current || dirty & /*styleGeneral*/ 2) && { style: /*styleGeneral*/ ctx[1] },
    				(!current || dirty & /*classGeneral*/ 1) && { class: /*classGeneral*/ ctx[0] }
    			]));

    			toggle_class(div, "svelte-zbu7j0", true);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"container","columns","gutter","order","xs","sm","md","lg","xl","xsOffset","smOffset","mdOffset","lgOffset","xlOffset"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Grid', slots, ['default']);
    	let { container = false } = $$props;
    	let { columns = 12 } = $$props;
    	let { gutter = null } = $$props;
    	let { order = null } = $$props;
    	let { xs = null } = $$props;
    	let { sm = null } = $$props;
    	let { md = null } = $$props;
    	let { lg = null } = $$props;
    	let { xl = null } = $$props;
    	let { xsOffset = null } = $$props;
    	let { smOffset = null } = $$props;
    	let { mdOffset = null } = $$props;
    	let { lgOffset = null } = $$props;
    	let { xlOffset = null } = $$props;
    	let classGeneral = '';
    	let styleGeneral = '';
    	let localColumns;
    	const unsubscribe = columnsStore.subscribe(value => localColumns = value);

    	const getValue = breakpoint => {
    		if (breakpoint > localColumns) {
    			breakpoint = localColumns;
    		}

    		return breakpoint
    		? `${breakpoint / localColumns * 100}%`
    		: false;
    	};

    	const createClassSize = () => {
    		let newClass = 'col-xs ';
    		newClass += sm ? 'col-sm ' : '';
    		newClass += md ? 'col-md ' : '';
    		newClass += lg ? 'col-lg ' : '';
    		newClass += xl ? 'col-xl ' : '';
    		newClass += xsOffset ? 'colSGR-offset-xs ' : '';
    		newClass += smOffset ? 'colSGR-offset-sm ' : '';
    		newClass += mdOffset ? 'colSGR-offset-md ' : '';
    		newClass += lgOffset ? 'colSGR-offset-lg ' : '';
    		newClass += xlOffset ? 'colSGR-offset-xl ' : '';
    		return newClass;
    	};

    	const createStyleSize = () => {
    		let newStyle = '';

    		newStyle += xs
    		? `--xsWidthSGR:${getValue(xs)}; `
    		: `--xsWidthSGR:100%; `;

    		newStyle += sm ? `--smWidthSGR:${getValue(sm)}; ` : '';
    		newStyle += md ? `--mdWidthSGR:${getValue(md)}; ` : '';
    		newStyle += lg ? `--lgWidthSGR:${getValue(lg)}; ` : '';
    		newStyle += xl ? `--xlWidthSGR:${getValue(xl)}; ` : '';
    		newStyle += xsOffset ? `--xsOffset:${getValue(xsOffset)}; ` : '';
    		newStyle += smOffset ? `--smOffset:${getValue(smOffset)}; ` : '';
    		newStyle += mdOffset ? `--mdOffset:${getValue(mdOffset)}; ` : '';
    		newStyle += lgOffset ? `--lgOffset:${getValue(lgOffset)}; ` : '';
    		newStyle += xlOffset ? `--xlOffset:${getValue(xlOffset)}; ` : '';
    		return newStyle;
    	};

    	const createGutter = () => {
    		return gutter
    		? `--paddingSGR:${gutter / 2}px;--marginSGR:-${gutter / 2}px;`
    		: '--paddingSGR:0px;--marginSGR:0px;';
    	};

    	onDestroy(() => unsubscribe());

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(2, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('container' in $$new_props) $$invalidate(3, container = $$new_props.container);
    		if ('columns' in $$new_props) $$invalidate(4, columns = $$new_props.columns);
    		if ('gutter' in $$new_props) $$invalidate(5, gutter = $$new_props.gutter);
    		if ('order' in $$new_props) $$invalidate(6, order = $$new_props.order);
    		if ('xs' in $$new_props) $$invalidate(7, xs = $$new_props.xs);
    		if ('sm' in $$new_props) $$invalidate(8, sm = $$new_props.sm);
    		if ('md' in $$new_props) $$invalidate(9, md = $$new_props.md);
    		if ('lg' in $$new_props) $$invalidate(10, lg = $$new_props.lg);
    		if ('xl' in $$new_props) $$invalidate(11, xl = $$new_props.xl);
    		if ('xsOffset' in $$new_props) $$invalidate(12, xsOffset = $$new_props.xsOffset);
    		if ('smOffset' in $$new_props) $$invalidate(13, smOffset = $$new_props.smOffset);
    		if ('mdOffset' in $$new_props) $$invalidate(14, mdOffset = $$new_props.mdOffset);
    		if ('lgOffset' in $$new_props) $$invalidate(15, lgOffset = $$new_props.lgOffset);
    		if ('xlOffset' in $$new_props) $$invalidate(16, xlOffset = $$new_props.xlOffset);
    		if ('$$scope' in $$new_props) $$invalidate(17, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onDestroy,
    		columnsStore,
    		container,
    		columns,
    		gutter,
    		order,
    		xs,
    		sm,
    		md,
    		lg,
    		xl,
    		xsOffset,
    		smOffset,
    		mdOffset,
    		lgOffset,
    		xlOffset,
    		classGeneral,
    		styleGeneral,
    		localColumns,
    		unsubscribe,
    		getValue,
    		createClassSize,
    		createStyleSize,
    		createGutter
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('container' in $$props) $$invalidate(3, container = $$new_props.container);
    		if ('columns' in $$props) $$invalidate(4, columns = $$new_props.columns);
    		if ('gutter' in $$props) $$invalidate(5, gutter = $$new_props.gutter);
    		if ('order' in $$props) $$invalidate(6, order = $$new_props.order);
    		if ('xs' in $$props) $$invalidate(7, xs = $$new_props.xs);
    		if ('sm' in $$props) $$invalidate(8, sm = $$new_props.sm);
    		if ('md' in $$props) $$invalidate(9, md = $$new_props.md);
    		if ('lg' in $$props) $$invalidate(10, lg = $$new_props.lg);
    		if ('xl' in $$props) $$invalidate(11, xl = $$new_props.xl);
    		if ('xsOffset' in $$props) $$invalidate(12, xsOffset = $$new_props.xsOffset);
    		if ('smOffset' in $$props) $$invalidate(13, smOffset = $$new_props.smOffset);
    		if ('mdOffset' in $$props) $$invalidate(14, mdOffset = $$new_props.mdOffset);
    		if ('lgOffset' in $$props) $$invalidate(15, lgOffset = $$new_props.lgOffset);
    		if ('xlOffset' in $$props) $$invalidate(16, xlOffset = $$new_props.xlOffset);
    		if ('classGeneral' in $$props) $$invalidate(0, classGeneral = $$new_props.classGeneral);
    		if ('styleGeneral' in $$props) $$invalidate(1, styleGeneral = $$new_props.styleGeneral);
    		if ('localColumns' in $$props) localColumns = $$new_props.localColumns;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		{
    			$$invalidate(0, classGeneral = container
    			? 'containerSGR'
    			: `colSGR ${createClassSize()}`);

    			if (container) {
    				$$invalidate(1, styleGeneral = createGutter());
    				columnsStore.update(() => columns || 12);
    			} else {
    				$$invalidate(1, styleGeneral = createStyleSize());

    				if (xs || sm || md || lg || xl) {
    					$$invalidate(1, styleGeneral += `--colFlexSGR:0;`);
    				} else {
    					$$invalidate(1, styleGeneral = `--colFlexSGR:1;`);
    				}

    				if (order || order === 0) {
    					$$invalidate(1, styleGeneral += `--orderSGR:${order};`);
    				}
    			}

    			if ($$restProps.style) {
    				$$invalidate(1, styleGeneral += $$restProps.style);
    			}

    			if ($$restProps.class) {
    				$$invalidate(0, classGeneral += ` ${$$restProps.class}`);
    			}
    		}
    	};

    	return [
    		classGeneral,
    		styleGeneral,
    		$$restProps,
    		container,
    		columns,
    		gutter,
    		order,
    		xs,
    		sm,
    		md,
    		lg,
    		xl,
    		xsOffset,
    		smOffset,
    		mdOffset,
    		lgOffset,
    		xlOffset,
    		$$scope,
    		slots
    	];
    }

    class Grid extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			container: 3,
    			columns: 4,
    			gutter: 5,
    			order: 6,
    			xs: 7,
    			sm: 8,
    			md: 9,
    			lg: 10,
    			xl: 11,
    			xsOffset: 12,
    			smOffset: 13,
    			mdOffset: 14,
    			lgOffset: 15,
    			xlOffset: 16
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Grid",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get container() {
    		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set container(value) {
    		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get columns() {
    		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set columns(value) {
    		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get gutter() {
    		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set gutter(value) {
    		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get order() {
    		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set order(value) {
    		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xs() {
    		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xs(value) {
    		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sm() {
    		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sm(value) {
    		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get md() {
    		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set md(value) {
    		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get lg() {
    		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lg(value) {
    		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xl() {
    		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xl(value) {
    		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xsOffset() {
    		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xsOffset(value) {
    		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get smOffset() {
    		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set smOffset(value) {
    		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get mdOffset() {
    		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set mdOffset(value) {
    		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get lgOffset() {
    		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lgOffset(value) {
    		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xlOffset() {
    		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xlOffset(value) {
    		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Config.svelte generated by Svelte v3.57.0 */

    const { console: console_1 } = globals;
    const file$1 = "src\\Config.svelte";

    // (33:4) <Grid md={12}>
    function create_default_slot_9(ctx) {
    	let h1;
    	let t;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t = text(/*title*/ ctx[0]);
    			add_location(h1, file$1, 33, 8, 832);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 1) set_data_dev(t, /*title*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(33:4) <Grid md={12}>",
    		ctx
    	});

    	return block;
    }

    // (36:4) <Grid md={6}>
    function create_default_slot_8(ctx) {
    	let dropdown;
    	let current;

    	dropdown = new Dropdown$1({
    			props: {
    				titleText: "Meio de Semana",
    				selectedId: "0",
    				items: /*diasMeioSemana*/ ctx[3]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(dropdown.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dropdown, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropdown.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropdown.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dropdown, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(36:4) <Grid md={6}>",
    		ctx
    	});

    	return block;
    }

    // (43:4) <Grid md={6}>
    function create_default_slot_7(ctx) {
    	let dropdown;
    	let current;

    	dropdown = new Dropdown$1({
    			props: {
    				titleText: "Fim de Semana",
    				selectedId: "0",
    				items: /*diasFimSemana*/ ctx[4]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(dropdown.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dropdown, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropdown.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropdown.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dropdown, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(43:4) <Grid md={6}>",
    		ctx
    	});

    	return block;
    }

    // (32:0) <Grid container gutter={12}>
    function create_default_slot_6(ctx) {
    	let grid0;
    	let t0;
    	let grid1;
    	let t1;
    	let grid2;
    	let current;

    	grid0 = new Grid({
    			props: {
    				md: 12,
    				$$slots: { default: [create_default_slot_9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	grid1 = new Grid({
    			props: {
    				md: 6,
    				$$slots: { default: [create_default_slot_8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	grid2 = new Grid({
    			props: {
    				md: 6,
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(grid0.$$.fragment);
    			t0 = space();
    			create_component(grid1.$$.fragment);
    			t1 = space();
    			create_component(grid2.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(grid0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(grid1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(grid2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const grid0_changes = {};

    			if (dirty & /*$$scope, title*/ 2049) {
    				grid0_changes.$$scope = { dirty, ctx };
    			}

    			grid0.$set(grid0_changes);
    			const grid1_changes = {};

    			if (dirty & /*$$scope*/ 2048) {
    				grid1_changes.$$scope = { dirty, ctx };
    			}

    			grid1.$set(grid1_changes);
    			const grid2_changes = {};

    			if (dirty & /*$$scope*/ 2048) {
    				grid2_changes.$$scope = { dirty, ctx };
    			}

    			grid2.$set(grid2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(grid0.$$.fragment, local);
    			transition_in(grid1.$$.fragment, local);
    			transition_in(grid2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(grid0.$$.fragment, local);
    			transition_out(grid1.$$.fragment, local);
    			transition_out(grid2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(grid0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(grid1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(grid2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(32:0) <Grid container gutter={12}>",
    		ctx
    	});

    	return block;
    }

    // (55:12) <Button on:click={() => click("Primary")}>
    function create_default_slot_5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Primary button");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(55:12) <Button on:click={() => click(\\\"Primary\\\")}>",
    		ctx
    	});

    	return block;
    }

    // (56:12) <Button kind="secondary" on:click={() => click("Secondary")}                  >
    function create_default_slot_4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Secondary button");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(56:12) <Button kind=\\\"secondary\\\" on:click={() => click(\\\"Secondary\\\")}                  >",
    		ctx
    	});

    	return block;
    }

    // (59:12) <Button kind="tertiary" on:click={() => click("Tertiary")}                  >
    function create_default_slot_3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Tertiary button");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(59:12) <Button kind=\\\"tertiary\\\" on:click={() => click(\\\"Tertiary\\\")}                  >",
    		ctx
    	});

    	return block;
    }

    // (62:12) <Button kind="danger" on:click={() => click("Danger")}                  >
    function create_default_slot_2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Danger button");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(62:12) <Button kind=\\\"danger\\\" on:click={() => click(\\\"Danger\\\")}                  >",
    		ctx
    	});

    	return block;
    }

    // (54:8) <Grid md={12}>
    function create_default_slot_1(ctx) {
    	let button0;
    	let t0;
    	let button1;
    	let t1;
    	let button2;
    	let t2;
    	let button3;
    	let current;

    	button0 = new Button$1({
    			props: {
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*click_handler*/ ctx[6]);

    	button1 = new Button$1({
    			props: {
    				kind: "secondary",
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*click_handler_1*/ ctx[7]);

    	button2 = new Button$1({
    			props: {
    				kind: "tertiary",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button2.$on("click", /*click_handler_2*/ ctx[8]);

    	button3 = new Button$1({
    			props: {
    				kind: "danger",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button3.$on("click", /*click_handler_3*/ ctx[9]);

    	const block = {
    		c: function create() {
    			create_component(button0.$$.fragment);
    			t0 = space();
    			create_component(button1.$$.fragment);
    			t1 = space();
    			create_component(button2.$$.fragment);
    			t2 = space();
    			create_component(button3.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(button1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(button2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(button3, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button0_changes = {};

    			if (dirty & /*$$scope*/ 2048) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 2048) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    			const button2_changes = {};

    			if (dirty & /*$$scope*/ 2048) {
    				button2_changes.$$scope = { dirty, ctx };
    			}

    			button2.$set(button2_changes);
    			const button3_changes = {};

    			if (dirty & /*$$scope*/ 2048) {
    				button3_changes.$$scope = { dirty, ctx };
    			}

    			button3.$set(button3_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(button2.$$.fragment, local);
    			transition_in(button3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			transition_out(button2.$$.fragment, local);
    			transition_out(button3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(button1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(button2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(button3, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(54:8) <Grid md={12}>",
    		ctx
    	});

    	return block;
    }

    // (53:4) <Grid container gutter={12}>
    function create_default_slot(ctx) {
    	let grid;
    	let current;

    	grid = new Grid({
    			props: {
    				md: 12,
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(grid.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(grid, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const grid_changes = {};

    			if (dirty & /*$$scope*/ 2048) {
    				grid_changes.$$scope = { dirty, ctx };
    			}

    			grid.$set(grid_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(grid.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(grid.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(grid, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(53:4) <Grid container gutter={12}>",
    		ctx
    	});

    	return block;
    }

    // (69:0) {#if toastOpen}
    function create_if_block(ctx) {
    	let toastnotification;
    	let current;

    	toastnotification = new ToastNotification$1({
    			props: {
    				kind: "info",
    				title: "Title",
    				subtitle: "Clicou em " + /*toastLabel*/ ctx[2],
    				caption: new Date().toLocaleString()
    			},
    			$$inline: true
    		});

    	toastnotification.$on("close", /*close_handler*/ ctx[10]);

    	const block = {
    		c: function create() {
    			create_component(toastnotification.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(toastnotification, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const toastnotification_changes = {};
    			if (dirty & /*toastLabel*/ 4) toastnotification_changes.subtitle = "Clicou em " + /*toastLabel*/ ctx[2];
    			toastnotification.$set(toastnotification_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(toastnotification.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(toastnotification.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(toastnotification, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(69:0) {#if toastOpen}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let grid0;
    	let t0;
    	let div;
    	let grid1;
    	let t1;
    	let if_block_anchor;
    	let current;

    	grid0 = new Grid({
    			props: {
    				container: true,
    				gutter: 12,
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	grid1 = new Grid({
    			props: {
    				container: true,
    				gutter: 12,
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block = /*toastOpen*/ ctx[1] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			create_component(grid0.$$.fragment);
    			t0 = space();
    			div = element("div");
    			create_component(grid1.$$.fragment);
    			t1 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(div, "class", "mt-30 svelte-wnzk9a");
    			add_location(div, file$1, 51, 0, 1206);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(grid0, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			mount_component(grid1, div, null);
    			insert_dev(target, t1, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const grid0_changes = {};

    			if (dirty & /*$$scope, title*/ 2049) {
    				grid0_changes.$$scope = { dirty, ctx };
    			}

    			grid0.$set(grid0_changes);
    			const grid1_changes = {};

    			if (dirty & /*$$scope*/ 2048) {
    				grid1_changes.$$scope = { dirty, ctx };
    			}

    			grid1.$set(grid1_changes);

    			if (/*toastOpen*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*toastOpen*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(grid0.$$.fragment, local);
    			transition_in(grid1.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(grid0.$$.fragment, local);
    			transition_out(grid1.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(grid0, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    			destroy_component(grid1);
    			if (detaching) detach_dev(t1);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Config', slots, []);
    	let { title } = $$props;

    	let diasMeioSemana = [
    		{ id: "0", text: "Segunda-feira" },
    		{ id: "1", text: "Terça-feira" },
    		{ id: "2", text: "Quarta-feira" },
    		{ id: "3", text: "Quinta-feira" },
    		{ id: "4", text: "Sexta-feira" }
    	];

    	let diasFimSemana = [{ id: "0", text: "Sábado" }, { id: "1", text: "Domingo" }];
    	let toastOpen = false;
    	let toastLabel;

    	function click(label) {
    		$$invalidate(2, toastLabel = label);
    		console.log("Clicou em " + toastLabel);
    		$$invalidate(1, toastOpen = true);
    	}

    	$$self.$$.on_mount.push(function () {
    		if (title === undefined && !('title' in $$props || $$self.$$.bound[$$self.$$.props['title']])) {
    			console_1.warn("<Config> was created without expected prop 'title'");
    		}
    	});

    	const writable_props = ['title'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Config> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => click("Primary");
    	const click_handler_1 = () => click("Secondary");
    	const click_handler_2 = () => click("Tertiary");
    	const click_handler_3 = () => click("Danger");

    	const close_handler = () => {
    		$$invalidate(1, toastOpen = false);
    		console.log("Close Toast!");
    	};

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    	};

    	$$self.$capture_state = () => ({
    		Dropdown: Dropdown$1,
    		Button: Button$1,
    		ToastNotification: ToastNotification$1,
    		Grid,
    		title,
    		diasMeioSemana,
    		diasFimSemana,
    		toastOpen,
    		toastLabel,
    		click
    	});

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('diasMeioSemana' in $$props) $$invalidate(3, diasMeioSemana = $$props.diasMeioSemana);
    		if ('diasFimSemana' in $$props) $$invalidate(4, diasFimSemana = $$props.diasFimSemana);
    		if ('toastOpen' in $$props) $$invalidate(1, toastOpen = $$props.toastOpen);
    		if ('toastLabel' in $$props) $$invalidate(2, toastLabel = $$props.toastLabel);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		title,
    		toastOpen,
    		toastLabel,
    		diasMeioSemana,
    		diasFimSemana,
    		click,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		close_handler
    	];
    }

    class Config extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { title: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Config",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get title() {
    		throw new Error("<Config>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Config>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.57.0 */
    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let config;
    	let current;

    	config = new Config({
    			props: { title: "Meu Componente" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(config.$$.fragment);
    			add_location(main, file, 4, 0, 62);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(config, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(config.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(config.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(config);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Config });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
