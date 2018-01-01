import test from 'ava';
import { FibonacciHeap } from '../';
import testHelper from '@tyriar/heap-tests/extract-min-tests';

testHelper.run(test, FibonacciHeap);
